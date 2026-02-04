# Reporting — Dashboard & Visualisation

## 1. Domain Model

### 1.1 Aggregates

**Dashboard** (aggregate root)
- Identity: `id: UUID`
- Owns: collection of `Widget` entities (via `dashboardId` FK)
- Owns: collection of `DashboardFilter` value objects (stored as JSON array)
- Enforces invariants on widget positioning, visibility, and filter behaviour

**ReportQuery** (separate aggregate)
- Identity: `id: UUID`
- Referenced by `Widget.queryId` — a Widget renders the result of a ReportQuery
- Referenced by `ExportJob.queryId` in the Export context

### 1.2 Entities & Value Objects

**Dashboard** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Display name |
| `description` | string | required | Description |
| `widgets` | Widget[] | `[]` | Stored as JSON; also separate Widget table |
| `filters` | DashboardFilter[] | `[]` | Stored as JSON array |
| `createdBy` | string | required | User ID of creator |
| `isPublic` | boolean | `false` | Public dashboards visible to all users |

**Widget** (child entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `dashboardId` | UUID | required | FK to Dashboard |
| `type` | WidgetType | required | `table`, `bar_chart`, `line_chart`, `pie_chart`, `metric`, `text` |
| `title` | string | required | Widget display title |
| `queryId` | UUID | nullable | FK to ReportQuery; null for `text` widgets |
| `config` | Record<string, any> | `{}` | Type-specific rendering configuration |
| `position` | `{ x, y, w, h }` | required | Grid position (x, y) and dimensions (w, h) |

**ReportQuery** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Display name |
| `pipelineId` | UUID | nullable | FK to Transformation Pipeline |
| `aggregation` | AggregationConfig | nullable | `{ groupBy, metrics }` |
| `filters` | QueryFilter[] | `[]` | Array of filter conditions |
| `cachedAt` | ISO string | null | When results were last cached |
| `cacheDuration` | number | null | Cache TTL in seconds |

**DashboardFilter** (value object)

| Field | Type | Notes |
|-------|------|-------|
| `field` | string | Data field to filter on |
| `label` | string | Display label |
| `type` | `select` / `date_range` / `text` | Filter input type |
| `options` | string[] | Available options for `select` type |
| `defaultValue` | string | Pre-selected value |

**AggregationConfig** (value object)

| Field | Type | Notes |
|-------|------|-------|
| `groupBy` | string[] | Fields to group by |
| `metrics` | AggregationMetric[] | Aggregation functions |

**AggregationMetric** (value object)

| Field | Type | Notes |
|-------|------|-------|
| `field` | string | Source field |
| `function` | `count` / `sum` / `avg` / `min` / `max` | Aggregation function |
| `alias` | string | Output column name |

**QueryFilter** (value object)

| Field | Type | Notes |
|-------|------|-------|
| `field` | string | Field to filter on |
| `operator` | `eq` / `neq` / `gt` / `lt` / `gte` / `lte` / `contains` / `in` | Comparison operator |
| `value` | any | Filter value |

**QueryResult** (value object — returned from execute)

| Field | Type | Notes |
|-------|------|-------|
| `columns` | string[] | Result column names |
| `rows` | Record<string, any>[] | Result data rows |
| `totalRows` | number | Total row count |
| `executedAt` | ISO string | Execution timestamp |

**WidgetType** (enumeration): `table` | `bar_chart` | `line_chart` | `pie_chart` | `metric` | `text`

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-RPT-01** | Widget `position` values must be non-negative integers: `x >= 0`, `y >= 0`, `w > 0`, `h > 0` |
| **INV-RPT-02** | A widget with type other than `text` must have a non-null `queryId` referencing an existing ReportQuery |
| **INV-RPT-03** | Dashboard `name` must be non-empty |
| **INV-RPT-04** | When dashboard filters are reset, all filter values revert to their `defaultValue` |
| **INV-RPT-05** | Public dashboards (`isPublic: true`) are visible to all authenticated users; private dashboards are visible only to the creator |
| **INV-RPT-06** | Deleting a dashboard must delete all associated widgets |

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-RPT-01** | DashboardCreated | CMD-RPT-01 completes | `{ dashboardId, name, createdBy }` |
| **EVT-RPT-02** | DashboardUpdated | CMD-RPT-02 completes | `{ dashboardId, changes }` |
| **EVT-RPT-03** | DashboardDeleted | CMD-RPT-03 completes | `{ dashboardId }` |
| **EVT-RPT-04** | WidgetCreated | CMD-RPT-04 completes | `{ widgetId, dashboardId, type }` |
| **EVT-RPT-05** | WidgetUpdated | CMD-RPT-05 completes | `{ widgetId, changes }` |
| **EVT-RPT-06** | WidgetDeleted | CMD-RPT-06 completes | `{ widgetId, dashboardId }` |
| **EVT-RPT-07** | QueryCreated | CMD-RPT-07 completes | `{ queryId, name }` |
| **EVT-RPT-08** | QueryExecuted | QRY-RPT-06 completes | `{ queryId, totalRows, executedAt }` |
| **EVT-RPT-09** | QueryUpdated | CMD-RPT-08 completes | `{ queryId, changes }` |
| **EVT-RPT-10** | QueryDeleted | CMD-RPT-09 completes | `{ queryId }` |

---

## 2. Commands

### CMD-RPT-01: Create Dashboard

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/dashboards` |
| **Guard** | `JwtAuthGuard` |
| **Input** | `{ name, description, isPublic?, filters? }` |
| **Preconditions** | User authenticated |
| **Postconditions** | New Dashboard created with `createdBy` set to current user |
| **Error cases** | 401 |
| **Events** | EVT-RPT-01 |

### CMD-RPT-02: Update Dashboard

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/dashboards/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Partial `{ name?, description?, isPublic?, filters? }` |
| **Preconditions** | Dashboard exists |
| **Postconditions** | Dashboard fields updated |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-02 |

### CMD-RPT-03: Delete Dashboard

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/dashboards/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Dashboard ID (path parameter) |
| **Preconditions** | Dashboard exists |
| **Postconditions** | Dashboard and all widgets removed (INV-RPT-06) |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-03 |

### CMD-RPT-04: Create Widget

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/dashboards/:dashboardId/widgets` |
| **Guard** | `JwtAuthGuard` |
| **Input** | `{ type, title, queryId?, config?, position }` |
| **Preconditions** | Dashboard exists; if type ≠ `text`, queryId must reference valid ReportQuery (INV-RPT-02) |
| **Postconditions** | New Widget created and associated with dashboard |
| **Error cases** | 404, 401, 400 (invalid position) |
| **Events** | EVT-RPT-04 |

### CMD-RPT-05: Update Widget

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/dashboards/:dashboardId/widgets/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Partial `{ type?, title?, queryId?, config?, position? }` |
| **Preconditions** | Widget exists within the specified dashboard |
| **Postconditions** | Widget fields updated |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-05 |

### CMD-RPT-06: Delete Widget

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/dashboards/:dashboardId/widgets/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Dashboard ID + Widget ID (path parameters) |
| **Preconditions** | Widget exists within the specified dashboard |
| **Postconditions** | Widget removed |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-06 |

### CMD-RPT-07: Create Query

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/queries` |
| **Guard** | `JwtAuthGuard` |
| **Input** | `{ name, pipelineId?, aggregation?, filters?, cacheDuration? }` |
| **Preconditions** | User authenticated |
| **Postconditions** | New ReportQuery created |
| **Error cases** | 401 |
| **Events** | EVT-RPT-07 |

### CMD-RPT-08: Update Query

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/queries/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Partial `{ name?, pipelineId?, aggregation?, filters?, cacheDuration? }` |
| **Preconditions** | Query exists |
| **Postconditions** | Query fields updated |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-09 |

### CMD-RPT-09: Delete Query

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/queries/:id` |
| **Guard** | `JwtAuthGuard` |
| **Input** | Query ID (path parameter) |
| **Preconditions** | Query exists |
| **Postconditions** | Query removed |
| **Error cases** | 404, 401 |
| **Events** | EVT-RPT-10 |

---

## 3. Queries

### QRY-RPT-01: List Dashboards

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/dashboards` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `Dashboard[]` |
| **Notes** | Returns public dashboards + dashboards created by current user (INV-RPT-05) |

### QRY-RPT-02: Get Dashboard

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/dashboards/:id` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `Dashboard` |
| **Notes** | 404 if not found |

### QRY-RPT-03: List Dashboard Widgets

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/dashboards/:dashboardId/widgets` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `Widget[]` |
| **Notes** | Returns all widgets for the specified dashboard |

### QRY-RPT-04: Get Widget

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/dashboards/:dashboardId/widgets/:id` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `Widget` |
| **Notes** | 404 if not found |

### QRY-RPT-05: List Queries

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/queries` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `ReportQuery[]` |

### QRY-RPT-06: Execute Query

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/queries/:id/execute` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `QueryResult` (`{ columns, rows, totalRows, executedAt }`) |
| **Notes** | Executes the query and returns results; respects cache if `cachedAt + cacheDuration` is not expired |

### QRY-RPT-07: Get Query

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/queries/:id` |
| **Guard** | `JwtAuthGuard` |
| **Output** | `ReportQuery` |
| **Notes** | 404 if not found |

---

## 4. Frontend State

### Store Pattern: NgRx signalStore (with Entities)

**Library:** `libs/reporting-state`

### DashboardsStore

```typescript
DashboardsStore = signalStore(
  { providedIn: 'root' },
  withEntities<PersistedDashboard>(),
  withState({
    selectedId: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  withComputed(({ entities, selectedId }) => ({
    selectedDashboard: computed(() => /* find by selectedId */),
    publicDashboards: computed(() => entities().filter(d => d.isPublic)),
  })),
  withMethods((store, dashboardsService) => ({
    async loadAll() { /* GET /api/dashboards */ },
    select(id: string) { /* patchState selectedId */ },
    resetSelection() { /* patchState selectedId: null */ },
    async create(dashboard) { /* POST /api/dashboards */ },
    async update(dashboard) { /* PATCH /api/dashboards/:id */ },
    async remove(dashboard) { /* DELETE /api/dashboards/:id */ },
  })),
  withHooks({
    onInit(store) { store.loadAll(); },
  })
);
```

### Store API

| Method / Computed | Type | Description |
|-------------------|------|-------------|
| `entities()` | `Signal<Dashboard[]>` | All loaded dashboards |
| `selectedId()` | `Signal<string \| null>` | Currently selected dashboard ID |
| `selectedDashboard()` | `Signal<Dashboard \| undefined>` | Currently selected dashboard entity |
| `publicDashboards()` | `Signal<Dashboard[]>` | Dashboards where `isPublic === true` |
| `loading()` | `Signal<boolean>` | Loading state |
| `error()` | `Signal<string \| null>` | Error message |
| `loadAll()` | `Promise<void>` | Fetch all dashboards |
| `select(id)` | `void` | Set selected dashboard |
| `resetSelection()` | `void` | Clear selection |
| `create(dashboard)` | `Promise<void>` | Create new dashboard |
| `update(dashboard)` | `Promise<void>` | Update existing dashboard |
| `remove(dashboard)` | `Promise<void>` | Delete dashboard |

---

## 5. Acceptance Criteria

### AC-RPT-01: View dashboards list

```gherkin
Given the user is authenticated
And there are existing dashboards in the system
When the user navigates to the Reporting page
Then the user should see a list of all accessible dashboards
And each dashboard should display its name, description, and public/private status
```

### AC-RPT-02: Select a dashboard

```gherkin
Given the user is authenticated
And there is an existing dashboard
When the user selects the dashboard from the list
Then the dashboard viewer should open
And the dashboard's widgets should be displayed
```

### AC-RPT-03: Create a new dashboard

```gherkin
Given the user is authenticated
And the user is on the Reporting page
When the user creates a dashboard with name "Sales Overview" and description "Monthly sales metrics"
And saves the dashboard
Then a new dashboard "Sales Overview" should appear in the list
And its createdBy should be the current user
```

### AC-RPT-04: Update a dashboard

```gherkin
Given the user is authenticated
And there is an existing dashboard named "Old Dashboard"
When the user edits the dashboard and changes the name to "Updated Dashboard"
And saves the changes
Then the dashboard should be displayed as "Updated Dashboard"
```

### AC-RPT-05: Delete a dashboard

```gherkin
Given the user is authenticated
And there is an existing dashboard named "To Delete"
When the user deletes the dashboard
Then "To Delete" should no longer appear in the dashboards list
And all associated widgets should be removed
```

### AC-RPT-06: Add a widget to a dashboard

```gherkin
Given the user is authenticated
And there is an existing dashboard
And there is an existing ReportQuery
When the user adds a widget of type "bar_chart" with title "Revenue Chart"
And assigns the query to the widget
And sets position { x: 0, y: 0, w: 6, h: 4 }
And saves the widget
Then the widget should appear on the dashboard
```

### AC-RPT-07: Widget type rendering

```gherkin
Given there is a dashboard with widgets of different types
When the user views the dashboard
Then table widgets should render as data tables
And bar_chart widgets should render as bar chart placeholders
And line_chart widgets should render as line chart placeholders
And pie_chart widgets should render as pie chart placeholders
And metric widgets should render as single-value metric cards
And text widgets should render as text content blocks
```

### AC-RPT-08: Widget grid positioning

```gherkin
Given there is a dashboard with multiple widgets
When the user views the dashboard
Then each widget should be positioned according to its position { x, y, w, h }
And widgets should not have negative position values
And widget dimensions w and h should be greater than zero
```

### AC-RPT-09: Execute a report query

```gherkin
Given the user is authenticated
And there is a ReportQuery with aggregation and filters configured
When the user executes the query
Then the system should return a QueryResult with columns, rows, totalRows, and executedAt
And the results should respect the configured aggregation and filters
```

### AC-RPT-10: Dashboard filter behaviour

```gherkin
Given there is a dashboard with filters configured
When the user applies a filter value
Then the dashboard widgets should reflect the filtered data
When the user resets filters
Then all filters should revert to their default values
```

### AC-RPT-11: Public vs private dashboard visibility

```gherkin
Given user A creates a dashboard with isPublic: true
And user B creates a dashboard with isPublic: false
When user A views the dashboards list
Then user A should see their own dashboards and user B's public dashboards
But user A should not see user B's private dashboards
When user B views the dashboards list
Then user B should see their own dashboards (public and private) and user A's public dashboards
```

### AC-RPT-12: Query CRUD operations

```gherkin
Given the user is authenticated
When the user creates a ReportQuery with name "Monthly Sales"
Then the query should appear in the queries list
When the user updates the query name to "Quarterly Sales"
Then the updated name should be reflected
When the user deletes the query
Then the query should no longer appear in the list
```

### AC-RPT-13: Role-based access

```gherkin
Given a user is authenticated
When the user navigates to the Reporting page
Then all authenticated users should be able to view public dashboards
And all authenticated users should be able to create, edit, and delete their own dashboards
And only the creator should be able to modify a private dashboard
```

---

## 6. API Contract Summary

| Method | Path | Guard | Request Body | Response | Spec Ref |
|--------|------|-------|-------------|----------|----------|
| `POST` | `/api/dashboards` | JWT | `Dashboard` (partial) | `Dashboard` | CMD-RPT-01 |
| `GET` | `/api/dashboards` | JWT | — | `Dashboard[]` | QRY-RPT-01 |
| `GET` | `/api/dashboards/:id` | JWT | — | `Dashboard` | QRY-RPT-02 |
| `PATCH` | `/api/dashboards/:id` | JWT | `Dashboard` (partial) | `Dashboard` | CMD-RPT-02 |
| `DELETE` | `/api/dashboards/:id` | JWT | — | `void` | CMD-RPT-03 |
| `POST` | `/api/dashboards/:did/widgets` | JWT | `Widget` (partial) | `Widget` | CMD-RPT-04 |
| `GET` | `/api/dashboards/:did/widgets` | JWT | — | `Widget[]` | QRY-RPT-03 |
| `GET` | `/api/dashboards/:did/widgets/:id` | JWT | — | `Widget` | QRY-RPT-04 |
| `PATCH` | `/api/dashboards/:did/widgets/:id` | JWT | `Widget` (partial) | `Widget` | CMD-RPT-05 |
| `DELETE` | `/api/dashboards/:did/widgets/:id` | JWT | — | `void` | CMD-RPT-06 |
| `POST` | `/api/queries` | JWT | `ReportQuery` (partial) | `ReportQuery` | CMD-RPT-07 |
| `GET` | `/api/queries` | JWT | — | `ReportQuery[]` | QRY-RPT-05 |
| `GET` | `/api/queries/:id` | JWT | — | `ReportQuery` | QRY-RPT-07 |
| `GET` | `/api/queries/:id/execute` | JWT | — | `QueryResult` | QRY-RPT-06 |
| `PATCH` | `/api/queries/:id` | JWT | `ReportQuery` (partial) | `ReportQuery` | CMD-RPT-08 |
| `DELETE` | `/api/queries/:id` | JWT | — | `void` | CMD-RPT-09 |
