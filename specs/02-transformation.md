# Transformation — Pipeline Builder

## 1. Domain Model

### 1.1 Aggregates

**Pipeline** (aggregate root)
- Identity: `id: UUID`
- Owns: ordered collection of `TransformStep` entities (via `pipelineId` FK, `@OneToMany` eager)
- Owns: collection of `PipelineRun` history records (via `pipelineId` FK)
- Enforces invariants on step ordering, status transitions, and source validity

### 1.2 Entities & Value Objects

**Pipeline** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Display name |
| `description` | string | `''` | Optional description |
| `sourceId` | UUID | required | FK to Ingress DataSource |
| `steps` | TransformStep[] | `[]` | Eager-loaded child collection |
| `status` | PipelineStatus | `draft` | `draft`, `active`, `paused`, `error` |
| `lastRunAt` | ISO string | null | Timestamp of last successful run |
| `createdBy` | string | `''` | User ID of creator |

**TransformStep** (child entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `pipelineId` | UUID | required | FK to Pipeline |
| `order` | number | 0 | Position in pipeline (0-indexed) |
| `type` | StepType | required | `filter`, `map`, `aggregate`, `join`, `sort`, `deduplicate` |
| `config` | Record<string, any> | `{}` | Type-specific configuration |
| `inputSchema` | SchemaField[] | `[]` | Expected input fields |
| `outputSchema` | SchemaField[] | `[]` | Produced output fields |

**PipelineRun** (child entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `pipelineId` | UUID | required | FK to Pipeline |
| `status` | RunStatus | `running` | `running`, `completed`, `failed` |
| `startedAt` | ISO string | required | Execution start time |
| `completedAt` | ISO string | null | Execution end time |
| `recordsProcessed` | number | 0 | Count of processed records |
| `errors` | string[] | `[]` | Error messages from execution |

**StepType** (enumeration): `filter` | `map` | `aggregate` | `join` | `sort` | `deduplicate`

**PipelineStatus** (enumeration): `draft` | `active` | `paused` | `error`

**RunStatus** (enumeration): `running` | `completed` | `failed`

### Step Type Configuration

| Step Type | Config Shape | Schema Propagation |
|-----------|-------------|-------------------|
| `filter` | `{ field, operator, value }` | Output schema = input schema (rows removed, columns unchanged) |
| `map` | `{ mappings: [{ from, to, expression? }] }` | Output schema = renamed/computed fields |
| `aggregate` | `{ groupBy: string[], metrics: [{ field, function, alias }] }` | Output schema = groupBy fields + metric aliases |
| `join` | `{ targetSourceId, joinField, joinType }` | Output schema = input fields + target fields |
| `sort` | `{ field, direction }` | Output schema = input schema (order changed, columns unchanged) |
| `deduplicate` | `{ fields: string[] }` | Output schema = input schema (duplicates removed, columns unchanged) |

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-TRN-01** | Step `order` values within a pipeline must be contiguous integers starting from 0 |
| **INV-TRN-02** | `sourceId` must reference a valid DataSource in the Ingress context |
| **INV-TRN-03** | Pipeline `status` transitions: `draft` → `active` (on first run); `active` ↔ `paused`; any → `error` (on failed run) |
| **INV-TRN-04** | Reordering a step must renumber all steps to maintain contiguous order (INV-TRN-01) |
| **INV-TRN-05** | A pipeline must have a non-empty `name` |
| **INV-TRN-06** | PipelineRun `status` transitions: `running` → `completed` or `running` → `failed` (terminal states, no reversal) |
| **INV-TRN-07** | Deleting a step must renumber remaining steps to maintain contiguous order |

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-TRN-01** | PipelineCreated | CMD-TRN-01 completes | `{ pipelineId, name, sourceId }` |
| **EVT-TRN-02** | PipelineUpdated | CMD-TRN-02 completes | `{ pipelineId, changes }` |
| **EVT-TRN-03** | PipelineDeleted | CMD-TRN-03 completes | `{ pipelineId }` |
| **EVT-TRN-04** | PipelineRunStarted | CMD-TRN-04 begins | `{ pipelineId, runId }` |
| **EVT-TRN-05** | PipelineRunCompleted | CMD-TRN-04 succeeds | `{ pipelineId, runId, recordsProcessed }` |
| **EVT-TRN-06** | PipelineRunFailed | CMD-TRN-04 fails | `{ pipelineId, runId, errors }` |
| **EVT-TRN-07** | StepCreated | CMD-TRN-05 completes | `{ stepId, pipelineId, type, order }` |
| **EVT-TRN-08** | StepUpdated | CMD-TRN-06 completes | `{ stepId, changes }` |
| **EVT-TRN-09** | StepDeleted | CMD-TRN-07 completes | `{ stepId, pipelineId }` |
| **EVT-TRN-10** | StepReordered | CMD-TRN-08 completes | `{ stepId, pipelineId, newOrder }` |

---

## 2. Commands

### CMD-TRN-01: Create Pipeline

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/pipelines` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | `{ name, description?, sourceId }` |
| **Preconditions** | User authenticated with required role; `sourceId` references valid Ingress source |
| **Postconditions** | New Pipeline created with status `draft`, empty steps |
| **Error cases** | 401, 403, 400 (missing name) |
| **Events** | EVT-TRN-01 |

### CMD-TRN-02: Update Pipeline

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/pipelines/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Partial `{ name?, description?, sourceId?, status? }` |
| **Preconditions** | Pipeline exists |
| **Postconditions** | Pipeline fields updated |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-TRN-02 |

### CMD-TRN-03: Delete Pipeline

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/pipelines/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Pipeline ID (path parameter) |
| **Preconditions** | Pipeline exists |
| **Postconditions** | Pipeline and all child steps/runs removed |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-TRN-03 |

### CMD-TRN-04: Run Pipeline

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/pipelines/:id/run` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Pipeline ID (path parameter) |
| **Preconditions** | Pipeline exists |
| **Postconditions** | New PipelineRun created with status `running`; on completion: status → `completed`, `recordsProcessed` set, pipeline `lastRunAt` updated, pipeline status → `active`; on failure: run status → `failed`, pipeline status → `error` |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-TRN-04, then EVT-TRN-05 or EVT-TRN-06 |

### CMD-TRN-05: Create Step

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/steps` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | `{ pipelineId, type, config?, order? }` |
| **Preconditions** | Pipeline exists; type is valid StepType |
| **Postconditions** | New step created; order set to next available position if not specified |
| **Error cases** | 404 (pipeline not found), 401, 403 |
| **Events** | EVT-TRN-07 |

### CMD-TRN-06: Update Step

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/steps/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Partial `{ type?, config?, inputSchema?, outputSchema? }` |
| **Preconditions** | Step exists |
| **Postconditions** | Step fields updated |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-TRN-08 |

### CMD-TRN-07: Delete Step

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/steps/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | Step ID (path parameter) |
| **Preconditions** | Step exists |
| **Postconditions** | Step removed; remaining steps in pipeline renumbered (INV-TRN-07) |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-TRN-09 |

### CMD-TRN-08: Reorder Step

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/steps/:id/reorder` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `engineer` |
| **Input** | `{ newOrder: number }` |
| **Preconditions** | Step exists; `newOrder` is within valid range [0, stepCount-1] |
| **Postconditions** | Step moved to new position; all steps renumbered contiguously (INV-TRN-04) |
| **Error cases** | 404, 401, 403, 400 (invalid order) |
| **Events** | EVT-TRN-10 |

---

## 3. Queries

### QRY-TRN-01: List Pipelines

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/pipelines` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `Pipeline[]` (with eager-loaded steps) |
| **Notes** | Returns all pipelines |

### QRY-TRN-02: Get Pipeline

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/pipelines/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `Pipeline` (with eager-loaded steps) |
| **Notes** | 404 if not found |

### QRY-TRN-03: Get Pipeline Preview

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/pipelines/:id/preview` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `SchemaField[]` (output schema after all steps) |
| **Notes** | Cross-domain: fetches source schema from Ingress API (IP-01), then applies step transformations; returns the final output schema |

### QRY-TRN-04: Get Pipeline Runs

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/pipelines/:id/runs` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `PipelineRun[]` |
| **Notes** | Ordered by `startedAt` descending |

### QRY-TRN-05: List Steps

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/steps` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `TransformStep[]` |
| **Notes** | Returns all steps across all pipelines |

### QRY-TRN-06: Get Step

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/steps/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `TransformStep` |
| **Notes** | 404 if not found |

---

## 4. Frontend State

### Store Pattern: Classic NgRx (Entity Adapter + Functional Effects)

**Library:** `libs/transformation-state`

### State Shape

```typescript
interface PipelinesState extends EntityState<Pipeline> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
  preview: SchemaField[];
  runs: PipelineRun[];
}
```

### Actions

| Action | Payload | Trigger |
|--------|---------|---------|
| `loadPipelines` | — | Component init |
| `loadPipelinesSuccess` | `Pipeline[]` | API response |
| `loadPipelinesFailure` | `{ error }` | API error |
| `loadPipeline` | `{ id }` | Route param change |
| `loadPipelineSuccess` | `Pipeline` | API response |
| `createPipeline` | `Pipeline` | Form submit |
| `createPipelineSuccess` | `Pipeline` | API response |
| `updatePipeline` | `Pipeline` | Form submit |
| `updatePipelineSuccess` | `Pipeline` | API response |
| `deletePipeline` | `Pipeline` | Delete button click |
| `deletePipelineSuccess` | `Pipeline` | API response |
| `runPipeline` | `{ id }` | Run button click |
| `runPipelineSuccess` | `PipelineRun` | API response |
| `loadPreview` | `{ id }` | Preview tab selected |
| `loadPreviewSuccess` | `SchemaField[]` | API response |
| `loadRuns` | `{ id }` | Runs tab selected |
| `loadRunsSuccess` | `PipelineRun[]` | API response |
| `createStep` | `TransformStep` | Step form submit |
| `createStepSuccess` | `TransformStep` | API response |
| `updateStep` | `TransformStep` | Step form submit |
| `updateStepSuccess` | `TransformStep` | API response |
| `deleteStep` | `TransformStep` | Step delete button |
| `deleteStepSuccess` | `TransformStep` | API response |
| `reorderStep` | `{ id, newOrder }` | Drag-and-drop |
| `reorderStepSuccess` | `TransformStep` | API response |

### Effects

| Effect | Description |
|--------|-------------|
| `loadPipelines$` | `loadPipelines` → `GET /api/pipelines` → `loadPipelinesSuccess` |
| `loadPipeline$` | `loadPipeline` → `GET /api/pipelines/:id` → `loadPipelineSuccess` |
| `createPipeline$` | `createPipeline` → `POST /api/pipelines` → `createPipelineSuccess` |
| `updatePipeline$` | `updatePipeline` → `PATCH /api/pipelines/:id` → `updatePipelineSuccess` |
| `deletePipeline$` | `deletePipeline` → `DELETE /api/pipelines/:id` → `deletePipelineSuccess` |
| `runPipeline$` | `runPipeline` → `POST /api/pipelines/:id/run` → `runPipelineSuccess` |
| `loadPreview$` | `loadPreview` → `GET /api/pipelines/:id/preview` → `loadPreviewSuccess` |
| `loadRuns$` | `loadRuns` → `GET /api/pipelines/:id/runs` → `loadRunsSuccess` |
| `createStep$` | `createStep` → `POST /api/steps` → `createStepSuccess` |
| `updateStep$` | `updateStep` → `PATCH /api/steps/:id` → `updateStepSuccess` |
| `deleteStep$` | `deleteStep` → `DELETE /api/steps/:id` → `deleteStepSuccess` |
| `reorderStep$` | `reorderStep` → `PATCH /api/steps/:id/reorder` → `reorderStepSuccess` |
| `reloadAfterStepChange$` | After any step success → re-fetches the parent pipeline to get updated steps |

### Selectors

| Selector | Returns |
|----------|---------|
| `selectAllPipelines` | `Pipeline[]` |
| `selectSelectedPipeline` | `Pipeline | undefined` |
| `selectPipelinesLoaded` | `boolean` |
| `selectPipelinesError` | `string | null` |
| `selectPreview` | `SchemaField[]` |
| `selectRuns` | `PipelineRun[]` |

---

## 5. Acceptance Criteria

### AC-TRN-01: View pipelines list

```gherkin
Given the user is authenticated
And there are existing pipelines in the system
When the user navigates to the Transformation page
Then the user should see a list of all pipelines
And each pipeline should display its name, status, and source reference
```

### AC-TRN-02: Create a new pipeline

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And the user is on the Transformation page
When the user fills in pipeline name "ETL Pipeline"
And fills in description "Transform customer data"
And selects a source from the Ingress sources
And saves the pipeline
Then a new pipeline "ETL Pipeline" should appear in the list
And its status should be "draft"
```

### AC-TRN-03: Update a pipeline

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing pipeline named "Old Pipeline"
When the user edits the pipeline and changes the name to "Updated Pipeline"
And saves the changes
Then the pipeline should be displayed as "Updated Pipeline"
```

### AC-TRN-04: Delete a pipeline

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing pipeline named "To Delete"
When the user deletes the pipeline
Then "To Delete" should no longer appear in the pipelines list
And all associated steps and runs should be removed
```

### AC-TRN-05: Add a transform step

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing pipeline
When the user selects the pipeline
And adds a new step of type "filter"
And configures the filter with field "status", operator "eq", value "active"
And saves the step
Then the step should appear in the pipeline's step list
And the step order should be correct
```

### AC-TRN-06: Update a transform step

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a pipeline with an existing filter step
When the user edits the step config to change the value to "inactive"
And saves the changes
Then the step should reflect the updated configuration
```

### AC-TRN-07: Delete a transform step

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a pipeline with steps at orders 0, 1, 2
When the user deletes the step at order 1
Then the step should be removed
And the remaining steps should be renumbered to 0, 1
```

### AC-TRN-08: Reorder transform steps

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is a pipeline with steps A (order 0), B (order 1), C (order 2)
When the user moves step C to order 0
Then the steps should be ordered C (0), A (1), B (2)
And all step order values should be contiguous
```

### AC-TRN-09: Run a pipeline

```gherkin
Given the user is authenticated with role "admin" or "engineer"
And there is an existing pipeline with at least one step
When the user clicks "Run Pipeline"
Then a new PipelineRun should be created with status "running"
And the run should eventually complete with status "completed"
And the pipeline's lastRunAt should be updated
And the pipeline status should transition to "active"
```

### AC-TRN-10: View pipeline run history

```gherkin
Given there is a pipeline that has been run multiple times
When the user views the pipeline's run history
Then the user should see all runs ordered by startedAt descending
And each run should display status, startedAt, completedAt, and recordsProcessed
```

### AC-TRN-11: Preview pipeline output

```gherkin
Given there is a pipeline with a valid sourceId and transform steps
When the user requests a preview
Then the system should fetch the source schema from Ingress API (IP-01)
And apply each step's transformation to compute the output schema
And display the resulting schema fields
```

### AC-TRN-12: Preview with no steps

```gherkin
Given there is a pipeline with a valid sourceId but no steps
When the user requests a preview
Then the preview should show the raw source schema from Ingress
```

### AC-TRN-13: Step type configuration forms

```gherkin
Given the user is adding a new step
When the user selects type "filter"
Then the form should show field, operator, and value inputs
When the user selects type "map"
Then the form should show mapping configuration (from/to/expression)
When the user selects type "aggregate"
Then the form should show groupBy fields and metric configuration
```

### AC-TRN-14: Cross-domain schema fetch

```gherkin
Given there is a pipeline referencing sourceId "source-1"
When the Transformation backend fetches the preview
Then it should call GET http://localhost:3100/api/sources/source-1/schema
And use the returned schema as the initial input for step transformations
```

### AC-TRN-15: Role-based access control

```gherkin
Given a user is authenticated with role "user" (not admin or engineer)
When the user navigates to the Transformation page
Then the user should see the pipelines list (read access)
But the create, edit, delete, run, and step management controls should be hidden or disabled
```

---

## 6. API Contract Summary

| Method | Path | Guard Roles | Request Body | Response | Spec Ref |
|--------|------|-------------|-------------|----------|----------|
| `POST` | `/api/pipelines` | admin, engineer | `Pipeline` (partial) | `Pipeline` | CMD-TRN-01 |
| `GET` | `/api/pipelines` | any authenticated | — | `Pipeline[]` | QRY-TRN-01 |
| `GET` | `/api/pipelines/:id` | any authenticated | — | `Pipeline` | QRY-TRN-02 |
| `PATCH` | `/api/pipelines/:id` | admin, engineer | `Pipeline` (partial) | `Pipeline` | CMD-TRN-02 |
| `DELETE` | `/api/pipelines/:id` | admin, engineer | — | `void` | CMD-TRN-03 |
| `POST` | `/api/pipelines/:id/run` | admin, engineer | — | `PipelineRun` | CMD-TRN-04 |
| `GET` | `/api/pipelines/:id/preview` | any authenticated | — | `SchemaField[]` | QRY-TRN-03 |
| `GET` | `/api/pipelines/:id/runs` | any authenticated | — | `PipelineRun[]` | QRY-TRN-04 |
| `POST` | `/api/steps` | admin, engineer | `TransformStep` (partial) | `TransformStep` | CMD-TRN-05 |
| `GET` | `/api/steps` | any authenticated | — | `TransformStep[]` | QRY-TRN-05 |
| `GET` | `/api/steps/:id` | any authenticated | — | `TransformStep` | QRY-TRN-06 |
| `PATCH` | `/api/steps/:id` | admin, engineer | `TransformStep` (partial) | `TransformStep` | CMD-TRN-06 |
| `DELETE` | `/api/steps/:id` | admin, engineer | — | `void` | CMD-TRN-07 |
| `PATCH` | `/api/steps/:id/reorder` | admin, engineer | `{ newOrder }` | `TransformStep` | CMD-TRN-08 |
