# Ingress — Data Source Management

## 1. Domain Model

### 1.1 Aggregates

**DataSource** (aggregate root)
- Identity: `id: UUID`
- Owns: zero or more `DataSchema` entities (via `sourceId` foreign key)
- Enforces all invariants related to source lifecycle, connection testing, and syncing

### 1.2 Entities & Value Objects

**DataSource** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Display name |
| `type` | DataSourceType | required | `database`, `rest_api`, `csv_file`, `webhook` |
| `connectionConfig` | Record<string, string> | `{}` | Type-dependent connection parameters |
| `status` | ConnectionStatus | `disconnected` | `connected`, `disconnected`, `error`, `syncing`, `testing` |
| `lastSyncAt` | ISO string | null | Timestamp of last successful sync |
| `syncFrequency` | string | `manual` | Sync schedule |
| `errorLog` | string[] | `[]` | Append-only error history |
| `createdBy` | string | `''` | User ID of creator |

**DataSchema** (child entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `sourceId` | UUID | required | FK to DataSource |
| `fields` | SchemaField[] | `[]` | Discovered columns |
| `discoveredAt` | ISO string | required | When schema was discovered |
| `version` | number | 1 | Monotonically increasing per source |

**SchemaField** (value object)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Column/attribute name |
| `type` | FieldType | `string`, `number`, `boolean`, `date`, `object`, `array` |
| `nullable` | boolean | Whether nulls are allowed |
| `sampleValues` | string[] | Example values from the source |

**DataSourceType** (enumeration): `database` | `rest_api` | `csv_file` | `webhook`

**ConnectionStatus** (enumeration): `connected` | `disconnected` | `error` | `syncing` | `testing`

**ConnectionConfig by type** (value object, shape depends on DataSourceType):

| Type | Expected Keys |
|------|--------------|
| `database` | `host`, `port`, `database`, `username`, `password` |
| `rest_api` | `apiUrl`, `authType`, `authToken` |
| `csv_file` | `filePath`, `delimiter`, `encoding` |
| `webhook` | `callbackUrl`, `secret` |

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-ING-01** | `status` transitions follow: `disconnected` → `testing` → `connected`/`error`; `connected` → `syncing` → `connected`/`error`; any state → `disconnected` (on delete/reset) |
| **INV-ING-02** | `errorLog` is append-only — entries are never removed, only added |
| **INV-ING-03** | `DataSchema.version` is monotonically increasing per `sourceId` — each sync creates version N+1 |
| **INV-ING-04** | A source must have a non-empty `name` |
| **INV-ING-05** | A source must have a valid `type` from the DataSourceType enumeration |
| **INV-ING-06** | `connectionConfig` keys must be appropriate for the source `type` |
| **INV-ING-07** | Only sources in `connected` or `error` status may be synced |

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-ING-01** | SourceCreated | CMD-ING-01 completes | `{ sourceId, name, type }` |
| **EVT-ING-02** | SourceUpdated | CMD-ING-02 completes | `{ sourceId, changes }` |
| **EVT-ING-03** | SourceDeleted | CMD-ING-03 completes | `{ sourceId }` |
| **EVT-ING-04** | ConnectionTestStarted | CMD-ING-04 begins | `{ sourceId }` |
| **EVT-ING-05** | ConnectionTestSucceeded | CMD-ING-04 succeeds | `{ sourceId }` |
| **EVT-ING-06** | ConnectionTestFailed | CMD-ING-04 fails | `{ sourceId, error }` |
| **EVT-ING-07** | SyncStarted | CMD-ING-05 begins | `{ sourceId }` |
| **EVT-ING-08** | SyncCompleted | CMD-ING-05 succeeds | `{ sourceId, schemaId, version }` |
| **EVT-ING-09** | SyncFailed | CMD-ING-05 fails | `{ sourceId, error }` |
| **EVT-ING-10** | SchemaDiscovered | CMD-ING-06 completes | `{ sourceId, schemaId, fields }` |

---

## 2. Commands

### CMD-ING-01: Create Source

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/sources` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | `{ name, type, connectionConfig, syncFrequency? }` |
| **Preconditions** | User is authenticated with required role |
| **Postconditions** | New DataSource created with status `disconnected`; `createdBy` set to current user |
| **Error cases** | 401 Unauthorized (no/invalid JWT), 403 Forbidden (wrong role) |
| **Events** | EVT-ING-01 |

### CMD-ING-02: Update Source

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/sources/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Partial `{ name?, type?, connectionConfig?, syncFrequency? }` |
| **Preconditions** | Source with given ID exists |
| **Postconditions** | Source fields updated |
| **Error cases** | 404 Not Found, 401, 403 |
| **Events** | EVT-ING-02 |

### CMD-ING-03: Delete Source

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/sources/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Source ID (path parameter) |
| **Preconditions** | Source with given ID exists |
| **Postconditions** | Source removed from database |
| **Error cases** | 404 Not Found, 401, 403 |
| **Events** | EVT-ING-03 |

### CMD-ING-04: Test Connection

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/sources/:id/test-connection` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Source ID (path parameter) |
| **Preconditions** | Source with given ID exists |
| **Postconditions** | Status transitions to `testing`, then asynchronously to `connected` or `error`. On error, message appended to `errorLog` |
| **Error cases** | 404 Not Found, 401, 403 |
| **Events** | EVT-ING-04, then EVT-ING-05 or EVT-ING-06 |
| **Notes** | Frontend polls via `GET /api/sources/:id` every 2 seconds after initiating test |

### CMD-ING-05: Sync Source

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/sources/:id/sync` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Source ID (path parameter) |
| **Preconditions** | Source exists; status is `connected` or `error` (INV-ING-07) |
| **Postconditions** | Status transitions to `syncing` → `connected`; new DataSchema created with incremented version; `lastSyncAt` updated |
| **Error cases** | 404 Not Found, 401, 403, 409 Conflict (invalid status for sync) |
| **Events** | EVT-ING-07, then EVT-ING-08 or EVT-ING-09; EVT-ING-10 on schema discovery |

### CMD-ING-06: Discover Schema (internal)

| Field | Value |
|-------|-------|
| **Endpoint** | Internal — triggered by CMD-ING-05 |
| **Guard** | N/A (internal) |
| **Input** | `{ sourceId }` |
| **Preconditions** | Source is in `syncing` state |
| **Postconditions** | New DataSchema entity created with discovered fields and version = previous max + 1 |
| **Events** | EVT-ING-10 |

---

## 3. Queries

### QRY-ING-01: List Sources

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/sources` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `DataSource[]` |
| **Notes** | Returns all sources; no pagination currently |

### QRY-ING-02: Get Source

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/sources/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `DataSource` |
| **Notes** | 404 if not found; used for polling after test connection |

### QRY-ING-03: Get Source Schema

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/sources/:id/schema` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `DataSchema` (latest version for this source) |
| **Notes** | Used by Transformation context (IP-01) to fetch schema for preview |

### QRY-ING-04: List Schemas

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/schemas` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `DataSchema[]` |
| **Notes** | Returns all schemas across all sources |

### QRY-ING-05: Get Schema

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/schemas/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `DataSchema` |
| **Notes** | Returns a specific schema by ID |

---

## 4. Frontend State

### Store Pattern: Classic NgRx (Entity Adapter + Functional Effects)

**Library:** `libs/ingress-state`

### State Shape

```typescript
interface SourcesState extends EntityState<DataSource> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
  currentSchema: DataSchema | null;
}
```

### Actions

| Action | Payload | Trigger |
|--------|---------|---------|
| `loadSources` | — | Component init |
| `loadSourcesSuccess` | `DataSource[]` | API response |
| `loadSourcesFailure` | `{ error }` | API error |
| `loadSource` | `{ id }` | Route param change |
| `loadSourceSuccess` | `DataSource` | API response |
| `createSource` | `DataSource` | Form submit |
| `createSourceSuccess` | `DataSource` | API response |
| `updateSource` | `DataSource` | Form submit |
| `updateSourceSuccess` | `DataSource` | API response |
| `deleteSource` | `DataSource` | Delete button click |
| `deleteSourceSuccess` | `DataSource` | API response |
| `testConnection` | `{ id }` | Test button click |
| `testConnectionSuccess` | `DataSource` | Polling detects `connected` |
| `syncSource` | `{ id }` | Sync button click |
| `syncSourceSuccess` | `DataSource` | API response |
| `loadSchema` | `{ sourceId }` | Detail view load |
| `loadSchemaSuccess` | `DataSchema` | API response |

### Effects

| Effect | Trigger → API Call → Dispatch |
|--------|-------------------------------|
| `loadSources$` | `loadSources` → `GET /api/sources` → `loadSourcesSuccess` |
| `loadSource$` | `loadSource` → `GET /api/sources/:id` → `loadSourceSuccess` |
| `createSource$` | `createSource` → `POST /api/sources` → `createSourceSuccess` |
| `updateSource$` | `updateSource` → `PATCH /api/sources/:id` → `updateSourceSuccess` |
| `deleteSource$` | `deleteSource` → `DELETE /api/sources/:id` → `deleteSourceSuccess` |
| `testConnection$` | `testConnection` → `POST /api/sources/:id/test-connection` → starts polling |
| `pollAfterTest$` | After test → polls `GET /api/sources/:id` every 2s until status ≠ `testing` |
| `syncSource$` | `syncSource` → `POST /api/sources/:id/sync` → `syncSourceSuccess` |
| `loadSchema$` | `loadSchema` → `GET /api/sources/:id/schema` → `loadSchemaSuccess` |

### Selectors

| Selector | Returns |
|----------|---------|
| `selectAllSources` | `DataSource[]` |
| `selectSelectedSource` | `DataSource | undefined` |
| `selectSourcesLoaded` | `boolean` |
| `selectSourcesError` | `string | null` |
| `selectCurrentSchema` | `DataSchema | null` |

---

## 5. Acceptance Criteria

### AC-ING-01: View data sources list

```gherkin
Given the user is authenticated
And there are existing data sources in the system
When the user navigates to the Ingress page
Then the user should see a list of all data sources
And each source should display its name, type, and status
```

### AC-ING-02: Create a new data source

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And the user is on the Ingress page
When the user fills in source name "Test Database"
And selects source type "database"
And provides connection config with host "localhost" and port "5432"
And saves the source
Then a new data source "Test Database" should appear in the list
And its status should be "disconnected"
```

### AC-ING-03: Update an existing data source

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing data source named "Old Name"
When the user edits the source and changes the name to "New Name"
And saves the changes
Then the source should be displayed as "New Name" in the list
```

### AC-ING-04: Delete a data source

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing data source named "To Delete"
When the user deletes the source
Then "To Delete" should no longer appear in the sources list
```

### AC-ING-05: Test connection — success

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a data source with status "disconnected"
When the user clicks "Test Connection"
Then the status should change to "testing"
And the UI should poll for status updates
And eventually the status should change to "connected"
```

### AC-ING-06: Test connection — failure

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a data source with invalid connection config
When the user clicks "Test Connection"
Then the status should change to "testing"
And eventually the status should change to "error"
And a new entry should appear in the error log
```

### AC-ING-07: Test connection — polling behaviour

```gherkin
Given a test connection has been initiated
When the status is "testing"
Then the frontend should poll GET /api/sources/:id every 2 seconds
And polling should stop when the status is no longer "testing"
```

### AC-ING-08: Sync source schema

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a data source with status "connected"
When the user clicks "Sync"
Then the status should change to "syncing"
And a new DataSchema version should be created
And the lastSyncAt timestamp should be updated
And the status should return to "connected"
```

### AC-ING-09: View source schema

```gherkin
Given there is a data source with a discovered schema
When the user views the source details
Then the schema fields should be displayed
And each field should show name, type, nullable, and sample values
```

### AC-ING-10: Schema versioning

```gherkin
Given a data source has been synced twice
When the user views the source schema
Then the schema version should be 2
And both schema versions should exist in the schemas list
```

### AC-ING-11: Error log display

```gherkin
Given a data source has experienced connection errors
When the user views the source details
Then the error log should display all past errors
And errors should be in chronological order (append-only)
```

### AC-ING-12: Dynamic form by source type

```gherkin
Given the user is creating a new data source
When the user selects type "database"
Then the form should show fields for host, port, database, username, password
When the user selects type "rest_api"
Then the form should show fields for apiUrl, authType, authToken
When the user selects type "csv_file"
Then the form should show fields for filePath, delimiter, encoding
```

### AC-ING-13: Role-based access control

```gherkin
Given a user is authenticated with role "user" (not admin or engineer)
When the user navigates to the Ingress page
Then the user should see the sources list (read access)
But the create, edit, delete, test, and sync buttons should be hidden or disabled
```

---

## 6. API Contract Summary

| Method | Path | Guard Roles | Request Body | Response | Spec Ref |
|--------|------|-------------|-------------|----------|----------|
| `POST` | `/api/sources` | admin, engineer | `DataSource` (partial) | `DataSource` | CMD-ING-01 |
| `GET` | `/api/sources` | any authenticated | — | `DataSource[]` | QRY-ING-01 |
| `GET` | `/api/sources/:id` | any authenticated | — | `DataSource` | QRY-ING-02 |
| `PATCH` | `/api/sources/:id` | admin, engineer | `DataSource` (partial) | `DataSource` | CMD-ING-02 |
| `DELETE` | `/api/sources/:id` | admin, engineer | — | `void` | CMD-ING-03 |
| `POST` | `/api/sources/:id/test-connection` | admin, engineer | — | `DataSource` | CMD-ING-04 |
| `POST` | `/api/sources/:id/sync` | admin, engineer | — | `DataSource` | CMD-ING-05 |
| `GET` | `/api/sources/:id/schema` | any authenticated | — | `DataSchema` | QRY-ING-03 |
| `GET` | `/api/schemas` | any authenticated | — | `DataSchema[]` | QRY-ING-04 |
| `GET` | `/api/schemas/:id` | any authenticated | — | `DataSchema` | QRY-ING-05 |
