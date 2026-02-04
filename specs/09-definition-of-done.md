# Definition of Done

This document defines completion criteria at four levels: individual acceptance criterion, bounded context, cross-domain workflow, and platform-wide.

---

## Per Acceptance Criterion

An acceptance criterion (AC-{DOM}-NN) is **done** when all of the following are true:

- [ ] Gherkin scenario exists in the appropriate `e2e/features/{domain}.feature` file
- [ ] Step definitions exist in `e2e/steps/{domain}.steps.ts` and are compilable
- [ ] Backend endpoint returns correct HTTP status codes and response bodies for the happy path
- [ ] Backend endpoint returns correct error responses (401, 403, 404, 409) for error paths
- [ ] Frontend component handles the happy path (data loads, forms submit, state updates)
- [ ] Frontend component handles error paths (error messages displayed, loading states, disabled controls)
- [ ] Playwright E2E test passes against running backend and frontend services

---

## Per Bounded Context

A bounded context is **done** when all of the following are true:

- [ ] All acceptance criteria for the context are done (per above)
- [ ] All invariants (INV-{DOM}-NN) are enforced in backend service logic
- [ ] All commands return correct HTTP status codes:
  - `201 Created` for POST (create)
  - `200 OK` for GET, PATCH
  - `200 OK` or `204 No Content` for DELETE
  - `401 Unauthorized` for missing/invalid JWT
  - `403 Forbidden` for insufficient role
  - `404 Not Found` for missing resources
  - `409 Conflict` for business rule violations
- [ ] Seed data loads successfully for local development (`TypeORM` synchronize or migration)
- [ ] Module Federation remote builds without errors (`nx build {domain}`)
- [ ] Backend service starts and responds to health check requests
- [ ] No TypeScript compilation errors in domain libraries (`libs/{domain}-data/`, `libs/{domain}-state/`)
- [ ] NgRx store / signalStore actions, effects, selectors, or methods cover all commands and queries

---

## Per Cross-Domain Workflow

A cross-domain workflow (W-NN) is **done** when all of the following are true:

- [ ] E2E Gherkin scenario exists covering the full workflow
- [ ] Step definitions span multiple domain steps files as needed
- [ ] All inter-service HTTP calls (IP-01 through IP-04) resolve successfully
- [ ] Data references between contexts are consistent (e.g., `sourceId` in Pipeline matches an Ingress source)
- [ ] Data flows correctly from upstream to downstream contexts:
  - Ingress → Transformation (schema propagation via IP-01)
  - Transformation → Reporting (pipelineId reference via IP-02)
  - Reporting → Export (queryId reference via IP-03)
- [ ] Authentication works end-to-end (JWT validated at each hop via IP-04)
- [ ] Playwright E2E test passes with all required services running

---

## Platform-Level

The platform is **done** when all of the following are true:

- [ ] All bounded context DoDs are met (Ingress, Transformation, Reporting, Export, Users & Auth, Features & Infra)
- [ ] All cross-domain workflow DoDs are met (W-01 through W-05)
- [ ] All 16 Nx projects build successfully (`nx run-many --target=build --all`)
- [ ] All 6 NestJS backend services start and pass health checks
- [ ] All 6 Angular frontend applications (+ shell) start and serve
- [ ] Docker Compose brings up all services (`docker compose up`)
- [ ] No console errors during navigation between all shell routes
- [ ] Traceability matrix (`08-traceability-matrix.md`) shows all criteria at status "Passing"
- [ ] All ~67 acceptance criteria have passing Playwright tests
- [ ] All 5 cross-domain workflows have passing E2E tests

---

## Quality Gates

| Gate | Trigger | Required |
|------|---------|----------|
| **PR Gate** | Pull request to `main` | All changed domain's ACs pass; no new lint errors; TypeScript compiles |
| **Integration Gate** | Pre-merge | All cross-domain workflows involving changed contexts pass |
| **Release Gate** | Before deployment | Full platform-level DoD met |

---

*This document should be reviewed and updated as the platform evolves and new acceptance criteria are added.*
