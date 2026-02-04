# Cross-Domain Workflows

This document describes end-to-end scenarios that span multiple bounded contexts. Each workflow references acceptance criteria and integration points from the individual context specs.

---

## Integration Points

### IP-01: Transformation → Ingress (Schema Fetch)

| Field | Value |
|-------|-------|
| **Caller** | Transformation backend (`GET /api/pipelines/:id/preview`) |
| **Target** | Ingress API `GET http://localhost:3100/api/sources/:sourceId/schema` |
| **Data** | `DataSchema` (fields, version) |
| **Trigger** | When Transformation computes pipeline preview (QRY-TRN-03) |
| **Auth** | JWT token forwarded from original request |
| **Failure mode** | If Ingress is unreachable or source not found, preview returns error |
| **Related ACs** | AC-TRN-11, AC-TRN-12, AC-TRN-14 |

### IP-02: Reporting → Transformation (Pipeline Reference)

| Field | Value |
|-------|-------|
| **Caller** | Reporting context (ReportQuery entity) |
| **Target** | Transformation context (Pipeline entity) |
| **Data** | `ReportQuery.pipelineId` references `Pipeline.id` |
| **Pattern** | Data reference (not HTTP call) — pipelineId stored as UUID string |
| **Integrity** | No foreign key enforcement across services; pipelineId may reference a deleted pipeline |
| **Related ACs** | AC-RPT-09, AC-RPT-12 |

### IP-03: Export → Reporting (Query Reference)

| Field | Value |
|-------|-------|
| **Caller** | Export context (ExportJob entity) |
| **Target** | Reporting context (ReportQuery entity) |
| **Data** | `ExportJob.queryId` references `ReportQuery.id` |
| **Pattern** | Data reference (not HTTP call) — queryId stored as UUID string |
| **Integrity** | No foreign key enforcement across services; queryId may reference a deleted query |
| **Related ACs** | AC-EXP-02, AC-EXP-08 |

### IP-04: All Backends → Users (Token Validation)

| Field | Value |
|-------|-------|
| **Caller** | JwtAuthGuard in Features, Ingress, Transformation, Reporting, Export backends |
| **Target** | Users API `GET http://localhost:3500/api/users/auth/validate` |
| **Data** | JWT token (Authorization header) → User object response |
| **Trigger** | Every authenticated request to any backend |
| **Auth** | Bearer token forwarded |
| **Failure mode** | If Users API is unreachable, all guarded requests return 401 |
| **Configuration** | `AUTH_URL` env var (defaults to `http://localhost:3400` in guard code; Users service is on port 3500) |
| **Related ACs** | AC-USR-03, AC-USR-04, AC-USR-06 |

---

## Workflows

### W-01: Source to Export (End-to-End Data Pipeline)

**Contexts involved:** Ingress → Transformation → Reporting → Export

**Narrative:** A data engineer connects a new data source, builds a transformation pipeline, creates a dashboard with query results, and exports the data.

```gherkin
Scenario: Complete data pipeline from source to export

  # Phase 1: Ingress — Connect data source
  Given the user is authenticated with role "admin"
  When the user creates a data source "Customer DB" of type "database"
  And provides connection config with host "db.example.com" and port "5432"
  Then the source should be created with status "disconnected"

  When the user tests the connection
  Then the status should transition through "testing" to "connected"

  When the user syncs the source
  Then a DataSchema should be discovered with fields like "id", "name", "email"
  And the schema version should be 1

  # Phase 2: Transformation — Build pipeline
  When the user creates a pipeline "Customer ETL" referencing source "Customer DB"
  And adds a filter step: field "status", operator "eq", value "active"
  And adds a map step: rename "email" to "contact_email"
  Then the pipeline should have 2 steps in order 0, 1

  When the user previews the pipeline
  Then the preview should show the output schema after applying filter and map steps
  And the output schema should include "contact_email" instead of "email"

  When the user runs the pipeline
  Then a PipelineRun should be created and complete successfully

  # Phase 3: Reporting — Create dashboard
  When the user creates a ReportQuery "Active Customers" referencing the pipeline
  And configures aggregation: groupBy ["status"], metrics [{ field: "id", function: "count", alias: "customer_count" }]
  Then the query should be saved

  When the user creates a dashboard "Customer Dashboard"
  And adds a bar_chart widget linked to the "Active Customers" query
  Then the widget should be positioned on the dashboard grid

  When the user executes the query
  Then results should be returned with columns and rows

  # Phase 4: Export — Download results
  When the user creates an export job "Customer Export" referencing the query with format "csv"
  Then the job should be created with status "queued"
  And the job should progress through "processing" with increasing progress
  And the job should complete with an outputUrl, fileSize, and recordCount

  When the user clicks the download link
  Then the exported file should be available for download
```

**Integration points used:** IP-01 (schema fetch for preview), IP-02 (query→pipeline ref), IP-03 (job→query ref), IP-04 (auth throughout)

---

### W-02: Schema Propagation (Ingress → Transformation)

**Contexts involved:** Ingress → Transformation

**Narrative:** When a source schema changes, the transformation pipeline preview reflects the updated schema.

```gherkin
Scenario: Schema changes propagate to transformation preview

  Given a data source "Products" exists with schema version 1
  And the schema has fields: "id" (number), "name" (string), "price" (number)
  And a pipeline "Product ETL" references source "Products"
  And the pipeline has an aggregate step: groupBy ["name"], metrics [{ field: "price", function: "avg", alias: "avg_price" }]

  When the user previews the pipeline
  Then the Transformation backend calls GET http://localhost:3100/api/sources/{sourceId}/schema (IP-01)
  And the preview output schema should contain "name" (string) and "avg_price" (number)

  When the source is synced and a new schema version 2 is discovered
  And the new schema adds a field "category" (string)
  And the user previews the pipeline again
  Then the Transformation backend fetches the updated schema (version 2)
  And the aggregate step still groups by "name" with avg "price"
  And the "category" field is available for future step configuration
```

**Integration points used:** IP-01, IP-04

---

### W-03: Role-Based Access Across Domains

**Contexts involved:** Users & Auth → Ingress, Transformation, Reporting, Export

**Narrative:** Different user roles have different capabilities across all domain contexts.

```gherkin
Scenario: Admin has full access across all domains

  Given a user is authenticated with role "admin"
  When the user accesses the Ingress page
  Then CRUD, test connection, and sync operations are available
  When the user accesses the Transformation page
  Then pipeline CRUD, step management, and run operations are available
  When the user accesses the Reporting page
  Then dashboard, widget, and query CRUD operations are available
  When the user accesses the Export page
  Then job creation, cancellation, and deletion are available

Scenario: Engineer has write access to pipeline domains

  Given a user is authenticated with role "engineer"
  When the user accesses the Ingress page
  Then CRUD, test connection, and sync operations are available
  When the user accesses the Transformation page
  Then pipeline CRUD, step management, and run operations are available
  When the user accesses the Export page
  Then job creation and cancellation are available

Scenario: Regular user has read-only access

  Given a user is authenticated with role "user"
  When the user accesses the Ingress page
  Then only the sources list is visible (read-only)
  And create, edit, delete, test, and sync controls are hidden
  When the user accesses the Transformation page
  Then only the pipelines list is visible (read-only)
  When the user accesses the Export page
  Then only the jobs list is visible (read-only)
```

**Integration points used:** IP-04 (token validation on every request)

---

### W-04: Authentication Flow (Login → Guarded Requests)

**Contexts involved:** Users & Auth → all other contexts

**Narrative:** A user logs in, receives a JWT, and makes authenticated requests across all backend services.

```gherkin
Scenario: Login and make authenticated requests

  Given the Users API is running on port 3500
  And the Ingress API is running on port 3100
  And the JwtAuthGuard in Ingress is configured with AUTH_URL pointing to the Users API

  When the user sends POST /api/users/auth/login with valid credentials
  Then the response should contain an access_token

  When the user sends GET /api/sources with Authorization: Bearer {access_token}
  Then the Ingress JwtAuthGuard extracts the token
  And calls GET http://localhost:3500/api/users/auth/validate with the token (IP-04)
  And the Users API validates the JWT and returns the user object
  And the Ingress API returns the sources list

Scenario: Expired token is rejected across all services

  Given the user has an expired JWT token
  When the user sends any authenticated request to any backend
  Then the JwtAuthGuard calls the Users API validate endpoint
  And the Users API returns 401
  And the backend returns 401 to the client
```

**Integration points used:** IP-04

---

### W-05: Dashboard Navigation (Shell → Remote Loading)

**Contexts involved:** Features & Infra → all frontend remotes

**Narrative:** The shell loads the feature registry and dynamically routes to micro-frontend remotes.

```gherkin
Scenario: Shell loads features and navigates to remotes

  Given the Features API returns:
    | title          | slug             | remote_uri              | healthy |
    | Ingress        | ingress          | http://localhost:4202   | true    |
    | Transformation | transformation   | http://localhost:4203   | true    |
    | Reporting      | reporting        | http://localhost:4204   | true    |
    | Export         | export           | http://localhost:4205   | true    |
    | Users          | users            | http://localhost:4201   | true    |

  When the Dashboard shell initialises
  Then 5 dynamic routes should be created (one per feature slug)
  And the navigation sidebar should show 5 links

  When the user clicks "Ingress"
  Then the browser navigates to /ingress
  And loadRemoteModule fetches http://localhost:4202/remoteEntry.js
  And the Ingress remote's routes are loaded
  And the Ingress data sources page renders within the shell

  When the user clicks "Reporting"
  Then the browser navigates to /reporting
  And loadRemoteModule fetches http://localhost:4204/remoteEntry.js
  And the Reporting dashboards page renders within the shell

  When the user clicks the browser back button
  Then the user should return to the previous page (/ingress)
```

**Integration points used:** Feature registry (QRY-FTR-01), Module Federation loading

---

## Cross-Domain Dependency Summary

```
W-01 (Source to Export):
  Uses: AC-ING-02, AC-ING-05, AC-ING-08, AC-TRN-02, AC-TRN-05, AC-TRN-11,
        AC-TRN-09, AC-RPT-12, AC-RPT-09, AC-RPT-03, AC-RPT-06, AC-EXP-02,
        AC-EXP-04, AC-EXP-07
  Integration: IP-01, IP-02, IP-03, IP-04

W-02 (Schema Propagation):
  Uses: AC-ING-08, AC-ING-10, AC-TRN-11, AC-TRN-14
  Integration: IP-01, IP-04

W-03 (Role-Based Access):
  Uses: AC-ING-13, AC-TRN-15, AC-RPT-13, AC-EXP-10, AC-USR-06
  Integration: IP-04

W-04 (Authentication Flow):
  Uses: AC-USR-01, AC-USR-03, AC-USR-04
  Integration: IP-04

W-05 (Dashboard Navigation):
  Uses: AC-FTR-01, AC-FTR-02, AC-FTR-04
  Integration: Feature registry, Module Federation
```
