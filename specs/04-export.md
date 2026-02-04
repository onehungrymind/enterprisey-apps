# Export — Job Queue Management

## 1. Domain Model

### 1.1 Aggregates

**ExportJob** (aggregate root — single entity, no children)
- Identity: `id: UUID`
- Self-contained lifecycle from `queued` → `processing` → terminal state
- No child entities; progress, output metadata, and errors are fields on the aggregate

### 1.2 Entities & Value Objects

**ExportJob** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Display name |
| `queryId` | UUID | required | FK to Reporting ReportQuery |
| `format` | ExportFormat | `csv` | `csv`, `json`, `xlsx`, `pdf` |
| `status` | JobStatus | `queued` | `queued`, `processing`, `completed`, `failed`, `cancelled` |
| `progress` | number | 0 | Integer 0–100 |
| `scheduleCron` | string | null | Optional cron expression for scheduled exports |
| `outputUrl` | string | null | Download URL, set on completion |
| `createdBy` | string | `''` | User ID of creator |
| `startedAt` | ISO string | null | When processing began |
| `completedAt` | ISO string | null | When processing ended |
| `fileSize` | number | null | Output file size in bytes |
| `recordCount` | number | null | Number of records exported |
| `error` | string | null | Error message if failed |

**ExportFormat** (enumeration): `csv` | `json` | `xlsx` | `pdf`

**JobStatus** (enumeration): `queued` | `processing` | `completed` | `failed` | `cancelled`

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-EXP-01** | Job status lifecycle: `queued` → `processing` → `completed`/`failed`; `queued`/`processing` → `cancelled`. No other transitions. |
| **INV-EXP-02** | Only jobs in `queued` or `processing` status can be cancelled |
| **INV-EXP-03** | `progress` is monotonically increasing: once set to N, it cannot decrease below N |
| **INV-EXP-04** | `progress` must be an integer in range [0, 100] |
| **INV-EXP-05** | When status transitions to `completed`: `outputUrl`, `fileSize`, and `recordCount` must be set; `progress` must be 100 |
| **INV-EXP-06** | Frontend polling stops automatically when no active jobs remain (`hasActiveJobs` is false) |
| **INV-EXP-07** | `format` must be one of the valid ExportFormat values |

### Processing Simulation

The backend simulates export processing:
- After creation, job transitions from `queued` to `processing`
- Progress increments by 10–20% every 500ms
- On reaching 100%: status → `completed`, `outputUrl` set to simulated download path, `fileSize` and `recordCount` populated
- On simulated failure: status → `failed`, `error` message set

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-EXP-01** | JobCreated | CMD-EXP-01 completes | `{ jobId, name, queryId, format }` |
| **EVT-EXP-02** | JobStarted | Processing begins | `{ jobId, startedAt }` |
| **EVT-EXP-03** | JobProgressUpdated | Progress increment | `{ jobId, progress }` |
| **EVT-EXP-04** | JobCompleted | Processing finishes | `{ jobId, outputUrl, fileSize, recordCount }` |
| **EVT-EXP-05** | JobFailed | Processing error | `{ jobId, error }` |
| **EVT-EXP-06** | JobCancelled | CMD-EXP-02 completes | `{ jobId }` |
| **EVT-EXP-07** | JobDeleted | CMD-EXP-03 completes | `{ jobId }` |

---

## 2. Commands

### CMD-EXP-01: Create Export Job

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/jobs` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | `{ name, queryId, format?, scheduleCron? }` |
| **Preconditions** | User authenticated with required role; `queryId` references a valid ReportQuery |
| **Postconditions** | New ExportJob created with status `queued`, progress 0; processing simulation starts |
| **Error cases** | 401, 403 |
| **Events** | EVT-EXP-01, then EVT-EXP-02 |

### CMD-EXP-02: Cancel Job

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/jobs/:id/cancel` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Job ID (path parameter) |
| **Preconditions** | Job exists; status is `queued` or `processing` (INV-EXP-02) |
| **Postconditions** | Job status set to `cancelled`; processing stops |
| **Error cases** | 404, 401, 403, 409 (invalid status for cancellation) |
| **Events** | EVT-EXP-06 |

### CMD-EXP-03: Delete Job

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/jobs/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Job ID (path parameter) |
| **Preconditions** | Job exists |
| **Postconditions** | Job removed from database |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-EXP-07 |

---

## 3. Queries

### QRY-EXP-01: List Jobs

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/jobs` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `ExportJob[]` |
| **Notes** | Returns all jobs |

### QRY-EXP-02: Get Active Jobs

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/jobs/active` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `ExportJob[]` (where status is `queued` or `processing`) |
| **Notes** | Used by frontend polling to check progress of active jobs |

### QRY-EXP-03: Get Job

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/jobs/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `ExportJob` |
| **Notes** | 404 if not found |

---

## 4. Frontend State

### Store Pattern: NgRx signalStore (with Entities)

**Library:** `libs/export-state`

### ExportJobsStore

```typescript
ExportJobsStore = signalStore(
  { providedIn: 'root' },
  withEntities<PersistedExportJob>(),
  withState({
    selectedFormat: 'csv' as string,
    polling: false,
    loading: false,
    error: null as string | null,
  }),
  withComputed(({ entities }) => ({
    activeJobs: computed(() => entities().filter(j =>
      j.status === 'queued' || j.status === 'processing')),
    completedJobs: computed(() => entities().filter(j =>
      j.status === 'completed')),
    failedJobs: computed(() => entities().filter(j =>
      j.status === 'failed')),
    hasActiveJobs: computed(() => entities().some(j =>
      j.status === 'queued' || j.status === 'processing')),
  })),
  withMethods((store, jobsService) => ({
    async loadAll() { /* GET /api/jobs */ },
    async startExport(job) { /* POST /api/jobs */ },
    async cancelJob(jobId) { /* POST /api/jobs/:id/cancel */ },
    async removeJob(job) { /* DELETE /api/jobs/:id */ },
    async pollActiveJobs() { /* GET /api/jobs/active, update entities */ },
    setFormat(format) { /* patchState selectedFormat */ },
  })),
  withHooks({
    onInit(store) { store.loadAll(); },
  })
);
```

### Store API

| Method / Computed | Type | Description |
|-------------------|------|-------------|
| `entities()` | `Signal<ExportJob[]>` | All loaded jobs |
| `activeJobs()` | `Signal<ExportJob[]>` | Jobs with status `queued` or `processing` |
| `completedJobs()` | `Signal<ExportJob[]>` | Jobs with status `completed` |
| `failedJobs()` | `Signal<ExportJob[]>` | Jobs with status `failed` |
| `hasActiveJobs()` | `Signal<boolean>` | Whether any active jobs exist |
| `selectedFormat()` | `Signal<string>` | Currently selected export format |
| `polling()` | `Signal<boolean>` | Whether polling is active |
| `loading()` | `Signal<boolean>` | Loading state |
| `error()` | `Signal<string \| null>` | Error message |
| `loadAll()` | `Promise<void>` | Fetch all jobs |
| `startExport(job)` | `Promise<void>` | Create and start export |
| `cancelJob(jobId)` | `Promise<void>` | Cancel active job |
| `removeJob(job)` | `Promise<void>` | Delete job |
| `pollActiveJobs()` | `Promise<void>` | Poll for active job updates |
| `setFormat(format)` | `void` | Set selected export format |

---

## 5. Acceptance Criteria

### AC-EXP-01: View export page

```gherkin
Given the user is authenticated
When the user navigates to the Export page
Then the user should see the export form with name, query ID, and format fields
And the user should see the active jobs section
And the user should see the job history section
```

### AC-EXP-02: Create an export job

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And the user is on the Export page
When the user fills in export name "Monthly Report"
And fills in query ID referencing an existing ReportQuery
And selects format "csv"
And clicks "Start Export"
Then a new job should appear in the active jobs section
And its status should be "queued" initially
```

### AC-EXP-03: Format selection

```gherkin
Given the user is creating a new export job
When the user views the format selector
Then the available formats should be: csv, json, xlsx, pdf
And the default format should be "csv"
When the user selects "xlsx"
Then the selected format should update to "xlsx"
```

### AC-EXP-04: Progress tracking

```gherkin
Given an export job is in "processing" status
When the frontend polls for updates
Then the progress bar should reflect the current progress value (0-100)
And the progress should increase over time in 10-20% increments
And the progress should never decrease
```

### AC-EXP-05: Polling behaviour

```gherkin
Given there are active export jobs (queued or processing)
When the frontend is on the Export page
Then the store should poll GET /api/jobs/active periodically
And update the entities with the latest progress
When all jobs reach a terminal status (completed, failed, cancelled)
Then polling should stop automatically
```

### AC-EXP-06: Cancel an export job

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an active export job (queued or processing)
When the user clicks "Cancel" on the job
Then the job status should change to "cancelled"
And the job should no longer appear in active jobs
```

### AC-EXP-07: Download completed export

```gherkin
Given an export job has completed successfully
When the user views the job in the history
Then the job should display the outputUrl as a download link
And should display fileSize and recordCount
And the progress should be 100
```

### AC-EXP-08: Job history

```gherkin
Given there are completed, failed, and cancelled export jobs
When the user views the job history
Then the user should see all non-active jobs
And each job should display name, format, status, and completion time
And completed jobs should have a download link
And failed jobs should display the error message
```

### AC-EXP-09: Scheduled exports

```gherkin
Given the user is creating an export job
When the user provides a scheduleCron value
And saves the job
Then the job should be created with the scheduleCron field set
And the job should be displayed with its schedule information
```

### AC-EXP-10: Role-based access control

```gherkin
Given a user is authenticated with role "user" (not admin or engineer)
When the user navigates to the Export page
Then the user should see the job list (read access)
But the create, cancel, and delete controls should be hidden or disabled
```

---

## 6. API Contract Summary

| Method | Path | Guard Roles | Request Body | Response | Spec Ref |
|--------|------|-------------|-------------|----------|----------|
| `POST` | `/api/jobs` | admin, engineer | `ExportJob` (partial) | `ExportJob` | CMD-EXP-01 |
| `GET` | `/api/jobs` | any authenticated | — | `ExportJob[]` | QRY-EXP-01 |
| `GET` | `/api/jobs/active` | any authenticated | — | `ExportJob[]` | QRY-EXP-02 |
| `GET` | `/api/jobs/:id` | any authenticated | — | `ExportJob` | QRY-EXP-03 |
| `POST` | `/api/jobs/:id/cancel` | admin, engineer | — | `ExportJob` | CMD-EXP-02 |
| `DELETE` | `/api/jobs/:id` | admin, engineer | — | `void` | CMD-EXP-03 |
