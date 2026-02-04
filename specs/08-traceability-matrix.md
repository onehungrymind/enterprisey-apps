# Traceability Matrix

This document maps every acceptance criterion to its Cucumber feature file, scenario name, and source code locations. It serves as the single source of truth for test coverage and implementation status.

**Status values:** `Not Started` | `Scenario Written` | `Implemented` | `Passing`

---

## Ingress Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-ING-01 | `e2e/features/ingress.feature` | User can see the data sources list | `apis/ingress/src/app/sources/sources.controller.ts`, `sources.service.ts` | `apps/ingress/`, `libs/ingress-state/`, `libs/ingress-data/` | Scenario Written |
| AC-ING-02 | `e2e/features/ingress.feature` | User can create a new data source | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Scenario Written |
| AC-ING-03 | — | Update an existing data source | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Not Started |
| AC-ING-04 | — | Delete a data source | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Not Started |
| AC-ING-05 | `e2e/features/ingress.feature` | User can test a connection | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Scenario Written |
| AC-ING-06 | — | Test connection failure | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Not Started |
| AC-ING-07 | — | Test connection polling behaviour | — | `libs/ingress-state/src/lib/+state/sources.effects.ts` | Not Started |
| AC-ING-08 | — | Sync source schema | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Not Started |
| AC-ING-09 | — | View source schema | `apis/ingress/src/app/schemas/schemas.controller.ts` | `apps/ingress/`, `libs/ingress-state/` | Not Started |
| AC-ING-10 | — | Schema versioning | `apis/ingress/src/app/schemas/schemas.controller.ts`, `sources.service.ts` | `apps/ingress/` | Not Started |
| AC-ING-11 | — | Error log display | `apis/ingress/src/app/sources/sources.controller.ts` | `apps/ingress/` | Not Started |
| AC-ING-12 | — | Dynamic form by source type | — | `apps/ingress/` | Not Started |
| AC-ING-13 | — | Role-based access control | `libs/guards/remote-auth/` | `apps/ingress/` | Not Started |

**Coverage:** 3 of 13 acceptance criteria have existing skeleton scenarios.

---

## Transformation Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-TRN-01 | `e2e/features/transformation.feature` | User can see the pipelines list | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Scenario Written |
| AC-TRN-02 | `e2e/features/transformation.feature` | User can create a new pipeline | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Scenario Written |
| AC-TRN-03 | — | Update a pipeline | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-04 | — | Delete a pipeline | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-05 | `e2e/features/transformation.feature` | User can add a transform step | `apis/transformation/src/app/steps/steps.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Scenario Written |
| AC-TRN-06 | — | Update a transform step | `apis/transformation/src/app/steps/steps.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-07 | — | Delete a transform step | `apis/transformation/src/app/steps/steps.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-08 | — | Reorder transform steps | `apis/transformation/src/app/steps/steps.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-09 | `e2e/features/transformation.feature` | User can run a pipeline | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Scenario Written |
| AC-TRN-10 | — | View pipeline run history | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-11 | — | Preview pipeline output | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-12 | — | Preview with no steps | `apis/transformation/src/app/pipelines/pipelines.controller.ts` | `apps/transformation/`, `libs/transformation-state/` | Not Started |
| AC-TRN-13 | — | Step type configuration forms | — | `apps/transformation/` | Not Started |
| AC-TRN-14 | — | Cross-domain schema fetch | `apis/transformation/src/app/pipelines/pipelines.service.ts` | — | Not Started |
| AC-TRN-15 | — | Role-based access control | `libs/guards/remote-auth/` | `apps/transformation/` | Not Started |

**Coverage:** 4 of 15 acceptance criteria have existing skeleton scenarios.

---

## Reporting Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-RPT-01 | `e2e/features/reporting.feature` | User can see the dashboards list | `apis/reporting/src/app/dashboards/dashboards.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Scenario Written |
| AC-RPT-02 | `e2e/features/reporting.feature` | User can select a dashboard | `apis/reporting/src/app/dashboards/dashboards.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Scenario Written |
| AC-RPT-03 | — | Create a new dashboard | `apis/reporting/src/app/dashboards/dashboards.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-04 | — | Update a dashboard | `apis/reporting/src/app/dashboards/dashboards.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-05 | — | Delete a dashboard | `apis/reporting/src/app/dashboards/dashboards.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-06 | — | Add a widget to a dashboard | `apis/reporting/src/app/widgets/widgets.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-07 | `e2e/features/reporting.feature` | User can view widget placeholders | `apis/reporting/src/app/widgets/widgets.controller.ts` | `apps/reporting/` | Scenario Written |
| AC-RPT-08 | — | Widget grid positioning | — | `apps/reporting/` | Not Started |
| AC-RPT-09 | — | Execute a report query | `apis/reporting/src/app/queries/queries.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-10 | — | Dashboard filter behaviour | — | `apps/reporting/` | Not Started |
| AC-RPT-11 | — | Public vs private dashboard visibility | `apis/reporting/src/app/dashboards/dashboards.service.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-12 | — | Query CRUD operations | `apis/reporting/src/app/queries/queries.controller.ts` | `apps/reporting/`, `libs/reporting-state/` | Not Started |
| AC-RPT-13 | — | Role-based access | `libs/guards/remote-auth/` | `apps/reporting/` | Not Started |

**Coverage:** 3 of 13 acceptance criteria have existing skeleton scenarios.

---

## Export Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-EXP-01 | `e2e/features/export.feature` | User can see the export page | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/`, `libs/export-state/` | Scenario Written |
| AC-EXP-02 | `e2e/features/export.feature` | User can start an export job | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/`, `libs/export-state/` | Scenario Written |
| AC-EXP-03 | — | Format selection | — | `apps/export/`, `libs/export-state/` | Not Started |
| AC-EXP-04 | — | Progress tracking | `apis/export/src/app/jobs/jobs.service.ts` | `apps/export/`, `libs/export-state/` | Not Started |
| AC-EXP-05 | — | Polling behaviour | — | `libs/export-state/src/lib/state/export-jobs.store.ts` | Not Started |
| AC-EXP-06 | — | Cancel an export job | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/`, `libs/export-state/` | Not Started |
| AC-EXP-07 | `e2e/features/export.feature` | User can see completed exports | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/`, `libs/export-state/` | Scenario Written |
| AC-EXP-08 | — | Job history | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/`, `libs/export-state/` | Not Started |
| AC-EXP-09 | — | Scheduled exports | `apis/export/src/app/jobs/jobs.controller.ts` | `apps/export/` | Not Started |
| AC-EXP-10 | — | Role-based access control | `libs/guards/remote-auth/` | `apps/export/` | Not Started |

**Coverage:** 3 of 10 acceptance criteria have existing skeleton scenarios.

---

## Users & Auth Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-USR-01 | `e2e/features/auth.feature` | User can log in with valid credentials | `apis/users/src/app/users/users.controller.ts`, `auth/` | `libs/ui-login/`, `apps/dashboard/` | Scenario Written |
| AC-USR-02 | — | Login with invalid credentials | `apis/users/src/app/users/users.controller.ts` | `libs/ui-login/` | Not Started |
| AC-USR-03 | — | Token validation | `apis/users/src/app/users/users.controller.ts` | — | Not Started |
| AC-USR-04 | — | Token rejection | `apis/users/src/app/users/users.controller.ts` | — | Not Started |
| AC-USR-05 | — | User CRUD by admin | `apis/users/src/app/users/users.controller.ts` | `apps/users/`, `libs/users-state/` | Not Started |
| AC-USR-06 | — | Role enforcement across domains | `libs/guards/remote-auth/` | — | Not Started |
| AC-USR-07 | — | Password security | `apis/users/src/app/users/users.service.ts` | — | Not Started |
| AC-USR-08 | — | Logout | — | `apps/dashboard/`, `libs/ui-login/` | Not Started |

**Coverage:** 1 of 8 acceptance criteria have existing skeleton scenarios.

---

## Features & Infrastructure Domain

| Spec Ref | Feature File | Scenario Name | Backend Files | Frontend Files | Status |
|----------|-------------|---------------|---------------|----------------|--------|
| AC-FTR-01 | — | Feature registry | `apis/features/src/app/features/features.controller.ts` | `libs/features-state/` | Not Started |
| AC-FTR-02 | `e2e/features/dashboard.feature` | User can navigate to domain pages | `apis/features/src/app/features/features.controller.ts` | `apps/dashboard/` | Scenario Written |
| AC-FTR-03 | — | Feature health status | `apis/features/src/app/features/features.controller.ts` | `apps/dashboard/` | Not Started |
| AC-FTR-04 | — | Module Federation loading | — | `apps/dashboard/`, all remote `apps/` | Not Started |
| AC-FTR-05 | `e2e/features/dashboard.feature` | User can see the dashboard home page | — | `apps/dashboard/` | Scenario Written |

**Coverage:** 2 of 5 acceptance criteria have existing skeleton scenarios.

---

## Cross-Domain Workflows

| Spec Ref | Feature File | Scenario Name | Contexts Involved | Status |
|----------|-------------|---------------|-------------------|--------|
| W-01 | — | Source to Export | ING, TRN, RPT, EXP | Not Started |
| W-02 | — | Schema Propagation | ING, TRN | Not Started |
| W-03 | — | Role-Based Access Across Domains | USR, ING, TRN, RPT, EXP | Not Started |
| W-04 | — | Authentication Flow | USR, all backends | Not Started |
| W-05 | — | Dashboard Navigation | FTR, all frontends | Not Started |

**Coverage:** 0 of 5 workflows have dedicated end-to-end scenarios (dashboard.feature scenarios are mapped to AC-FTR-02 and AC-FTR-05 above).

---

## Coverage Summary

| Domain | Total ACs | Scenarios Written | Not Started | Gap |
|--------|----------|-------------------|-------------|-----|
| Ingress | 13 | 3 | 10 | 10 new scenarios needed |
| Transformation | 15 | 4 | 11 | 11 new scenarios needed |
| Reporting | 13 | 3 | 10 | 10 new scenarios needed |
| Export | 10 | 3 | 7 | 7 new scenarios needed |
| Users & Auth | 8 | 1 | 7 | 7 new scenarios needed |
| Features & Infra | 5 | 2 | 3 | 3 new scenarios needed |
| Cross-Domain | 5 | 0 | 5 | 5 new scenarios needed |
| **Total** | **69** | **16** | **53** | **~53 new scenarios needed** |

### Existing Feature Files

| File | Scenarios | Mapped ACs |
|------|-----------|------------|
| `e2e/features/auth.feature` | 1 | AC-USR-01 |
| `e2e/features/dashboard.feature` | 2 | AC-FTR-02, AC-FTR-05 |
| `e2e/features/ingress.feature` | 3 | AC-ING-01, AC-ING-02, AC-ING-05 |
| `e2e/features/transformation.feature` | 4 | AC-TRN-01, AC-TRN-02, AC-TRN-05, AC-TRN-09 |
| `e2e/features/reporting.feature` | 3 | AC-RPT-01, AC-RPT-02, AC-RPT-07 |
| `e2e/features/export.feature` | 3 | AC-EXP-01, AC-EXP-02, AC-EXP-07 |
| **Total** | **16** | **16 unique ACs mapped** |

---

*This is a living document. Update status as specs, scenarios, and implementations evolve.*
