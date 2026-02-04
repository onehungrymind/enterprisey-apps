# Platform Overview

## 1. System Purpose & Scope

The **Enterprisey Data Pipeline Platform** is a modular data engineering workbench built as an Nx monorepo. It enables users to connect data sources, build transformation pipelines, visualise results on dashboards, and export data in multiple formats.

### In Scope

- CRUD management of data sources with connection testing and schema discovery (Ingress)
- Visual pipeline builder with ordered transform steps and execution history (Transformation)
- Dashboard and widget management with report query execution (Reporting)
- Asynchronous export job queue with progress tracking (Export)
- User management with role-based access control and JWT authentication (Users & Auth)
- Dynamic micro-frontend shell with feature registry (Features & Infrastructure)

### Out of Scope

- Real-time streaming / CDC pipelines
- Multi-tenant data isolation (single-tenant only)
- External identity providers (OAuth, SAML) — local auth only
- Production-grade job scheduling (cron fields are stored but not executed)

---

## 2. Architecture Summary

### Nx Monorepo Layout

```
apps/               # Angular micro-frontend remotes + shell
  dashboard/        # Shell host (port 4200)
  ingress/          # Data source management (port 4202)
  transformation/   # Pipeline builder (port 4203)
  reporting/        # Dashboard & visualisation (port 4204)
  export/           # Job queue (port 4205)
  users/            # User management (port 4201)
  portal/           # Admin portal (port 4800, standalone)

apis/               # NestJS backend services
  features/         # Feature registry API (port 3000)
  ingress/          # Data ingress API (port 3100)
  transformation/   # Pipeline transformation API (port 3200)
  reporting/        # Reporting API (port 3300)
  export/           # Export jobs API (port 3400)
  users/            # Users & auth API (port 3500)

libs/               # Shared libraries
  api-interfaces/   # TypeScript interfaces for all domains
  guards/           # JWT & Roles guards (shared across backends)
  {domain}-data/    # Angular HTTP services per domain
  {domain}-state/   # NgRx stores per domain
  environment/      # APP_ENVIRONMENT injection token
  material/         # Angular Material re-exports
  testing/          # Mock data for testing
  ui-login/         # Shared login component

e2e/                # Playwright + Cucumber BDD tests
  features/         # Gherkin feature files
  steps/            # Step definitions
  fixtures/         # Test fixtures
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Monorepo | Nx | 22 |
| Frontend | Angular | 21 |
| State (classic) | NgRx | 21 |
| State (signal) | @ngrx/signals | 21 |
| Backend | NestJS | 11 |
| ORM | TypeORM | latest |
| Database | SQLite (better-sqlite3) | — |
| Auth | Passport (JWT + Local) | — |
| Password hashing | bcryptjs | — |
| E2E | Playwright + playwright-bdd | — |
| BDD | Cucumber / Gherkin | — |
| Module Federation | @angular-architects/module-federation | — |

### Port Assignments

| Service | Port | Route Prefix |
|---------|------|-------------|
| Dashboard Shell | 4200 | — |
| Users Frontend | 4201 | — |
| Ingress Frontend | 4202 | — |
| Transformation Frontend | 4203 | — |
| Reporting Frontend | 4204 | — |
| Export Frontend | 4205 | — |
| Portal | 4800 | — |
| Features API | 3000 | `/api/features` |
| Ingress API | 3100 | `/api/sources`, `/api/schemas` |
| Transformation API | 3200 | `/api/pipelines`, `/api/steps` |
| Reporting API | 3300 | `/api/dashboards`, `/api/queries` |
| Export API | 3400 | `/api/jobs` |
| Users API | 3500 | `/api/users` |

---

## 3. Context Map

### Bounded Context Inventory

| Context | Abbreviation | Backend Port | Frontend Port |
|---------|-------------|-------------|---------------|
| Ingress | ING | 3100 | 4202 |
| Transformation | TRN | 3200 | 4203 |
| Reporting | RPT | 3300 | 4204 |
| Export | EXP | 3400 | 4205 |
| Users & Auth | USR | 3500 | 4201 |
| Features & Infra | FTR | 3000 | 4200 (shell) |

### Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Features & Infra (FTR)                       │
│              Shell routing · Feature registry · MF loading          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ routes to
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌──────────────┐   schema   ┌──────────────┐  queryId  ┌──────────────┐
│   Ingress    │───(HTTP)──▶│Transformation│──(ref)───▶│  Reporting   │
│    (ING)     │            │    (TRN)     │           │    (RPT)     │
│              │            │              │           │              │
│ DataSource   │            │ Pipeline     │           │ Dashboard    │
│ DataSchema   │            │ TransformStep│           │ Widget       │
│              │            │ PipelineRun  │           │ ReportQuery  │
└──────────────┘            └──────────────┘           └──────┬───────┘
                                                              │ queryId
                                                              ▼
                                                       ┌──────────────┐
                                                       │    Export     │
                                                       │    (EXP)     │
                                                       │              │
                                                       │ ExportJob    │
                                                       └──────────────┘

        ┌──────────────────────────────────────────────────────┐
        │                  Users & Auth (USR)                    │
        │           JWT cross-cutting via JwtAuthGuard           │
        │      User · Company · Role-based access control        │
        └──────────────────────────────────────────────────────┘
```

### Integration Patterns

| From | To | Pattern | Mechanism |
|------|----|---------|-----------|
| Transformation | Ingress | HTTP call | `GET /api/sources/:id/schema` to fetch source schema for preview |
| Reporting | Transformation | Data reference | `ReportQuery.pipelineId` references a Pipeline |
| Export | Reporting | Data reference | `ExportJob.queryId` references a ReportQuery |
| All backends | Users | HTTP call | `JwtAuthGuard` calls `GET /api/users/auth/validate` on port 3500 |
| Shell | Features | HTTP call | Shell fetches feature registry to build dynamic routes |
| Shell | Remotes | Module Federation | `loadRemoteModule()` loads Angular routes from remote URLs |

---

## 4. Ubiquitous Language Glossary

| Term | Definition | Owning Context |
|------|-----------|----------------|
| **Data Source** | An external system (database, REST API, CSV file, webhook) from which data is ingested | Ingress |
| **Connection Config** | Type-dependent key-value pairs needed to connect to a Data Source (host, port, apiUrl, filePath, etc.) | Ingress |
| **Connection Status** | Current state of a Data Source: `connected`, `disconnected`, `error`, `syncing`, `testing` | Ingress |
| **Data Schema** | The discovered structure (fields with names, types, nullability) of a Data Source, versioned | Ingress |
| **Schema Field** | A single column/attribute in a Data Schema with name, type, nullable flag, and sample values | Ingress |
| **Sync** | The process of (re-)discovering a Data Source's schema and creating a new schema version | Ingress |
| **Test Connection** | A command that verifies connectivity to a Data Source and transitions status through `testing` → `connected`/`error` | Ingress |
| **Pipeline** | An ordered sequence of transform steps that processes data from an Ingress source | Transformation |
| **Transform Step** | A single operation in a Pipeline (filter, map, aggregate, join, sort, deduplicate) with input/output schemas | Transformation |
| **Pipeline Run** | A record of a Pipeline execution with status, timing, record count, and errors | Transformation |
| **Preview** | A simulated output showing the schema after all transform steps are applied | Transformation |
| **Step Reorder** | Moving a transform step to a new position, renumbering all steps contiguously | Transformation |
| **Dashboard** | A named container for widgets, with optional filters and public/private visibility | Reporting |
| **Widget** | A visual component on a dashboard (table, bar chart, line chart, pie chart, metric, text) with grid position | Reporting |
| **Report Query** | A saved query configuration with aggregation rules and filters, executed against pipeline output | Reporting |
| **Dashboard Filter** | A user-facing filter control (select, date range, text) applied across dashboard widgets | Reporting |
| **Query Result** | The output of executing a Report Query: columns, rows, total count, execution timestamp | Reporting |
| **Export Job** | An asynchronous task that exports a Report Query's results to a file (CSV, JSON, XLSX, PDF) | Export |
| **Job Status** | Lifecycle state of an Export Job: `queued` → `processing` → `completed`/`failed`/`cancelled` | Export |
| **Progress** | An integer 0–100 representing export completion percentage, updated in 10–20% increments | Export |
| **Output URL** | The download link generated when an Export Job completes | Export |
| **User** | An authenticated person with first name, last name, email, hashed password, role, and company | Users & Auth |
| **Role** | Access level controlling what a user can do: `admin`, `mentor`, `apprentice`, `user` | Users & Auth |
| **Domain Role** | Additional roles used in guard decorators: `engineer`, `analyst`, `tester` | Users & Auth |
| **Company** | An organisational entity that users belong to | Users & Auth |
| **JWT** | JSON Web Token issued on login, validated by all backend guards | Users & Auth |
| **Feature** | A registered micro-frontend with title, slug, remote URL, API URL, and health status | Features |
| **Shell** | The dashboard host application that dynamically loads micro-frontend remotes | Features |
| **Remote** | An Angular micro-frontend application exposed via Module Federation | Features |

---

## 5. Technology Decisions & Conventions

### Entity IDs
- All entities use UUID v4 primary keys generated by TypeORM (`@PrimaryGeneratedColumn('uuid')`)

### Timestamps
- All timestamps stored as ISO 8601 strings (not Date objects) for SQLite compatibility
- Fields: `lastSyncAt`, `discoveredAt`, `startedAt`, `completedAt`, `cachedAt`, `lastRunAt`

### API Route Prefixes
- All backend APIs are served under `/api/` via global prefix
- Controller routes: `/sources`, `/schemas`, `/pipelines`, `/steps`, `/dashboards`, `/queries`, `/jobs`, `/users`, `/features`

### Guard Pattern
- `JwtAuthGuard` is applied at the controller level via `@UseGuards(JwtAuthGuard, RolesGuard)`
- `@Roles(['admin', 'engineer'])` decorator restricts specific endpoints
- Guard validates JWT by calling Users API at `http://localhost:3500/api/users/auth/validate`
- `AUTH_URL` environment variable overrides the default URL

### State Management
- **Classic NgRx** (entity adapter + functional effects): Ingress, Transformation, Users, Features
- **NgRx signalStore** (withEntities + withMethods + withComputed): Reporting, Export

### Module Federation
- Each remote exposes `./Routes` pointing to its `entry.routes.ts`
- Shell dynamically loads remotes using `loadRemoteModule()` based on feature registry
- Shell host has empty `remotes: []` — all loaded at runtime

### Database
- TypeORM with `better-sqlite3` driver (Node 22 compatible)
- Each backend service has its own SQLite database file
- JSON columns use `simple-json` type for complex objects (connectionConfig, fields, config, etc.)

---

## 6. Cross-Reference ID Scheme

All identifiers in this specification follow a consistent naming convention to enable cross-referencing between documents:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `AC-{DOM}-NN` | Acceptance Criterion | `AC-ING-01`, `AC-TRN-05` |
| `CMD-{DOM}-NN` | Command (write operation) | `CMD-ING-01`, `CMD-EXP-03` |
| `QRY-{DOM}-NN` | Query (read operation) | `QRY-RPT-01`, `QRY-USR-02` |
| `INV-{DOM}-NN` | Invariant (business rule) | `INV-TRN-03`, `INV-EXP-01` |
| `EVT-{DOM}-NN` | Domain Event | `EVT-ING-01`, `EVT-TRN-06` |
| `W-NN` | Cross-domain Workflow | `W-01`, `W-05` |
| `IP-NN` | Integration Point | `IP-01`, `IP-04` |

Domain abbreviations: `ING` (Ingress), `TRN` (Transformation), `RPT` (Reporting), `EXP` (Export), `USR` (Users & Auth), `FTR` (Features & Infra).
