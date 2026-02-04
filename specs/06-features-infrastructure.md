# Features & Infrastructure — Feature Registry & Shell Routing

## 1. Domain Model

### 1.1 Aggregates

**Feature** (aggregate root)
- Identity: `id: UUID`
- Self-contained entity representing a registered micro-frontend module
- No child entities

### 1.2 Entities & Value Objects

**Feature** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `title` | string | required | Display name in navigation |
| `description` | string | required | Feature description |
| `remote_uri` | string | required | Module Federation remote URL (e.g., `http://localhost:4202`) |
| `api_uri` | string | required | Backend API URL (e.g., `http://localhost:3100/api`) |
| `slug` | string | required | URL path segment (e.g., `ingress`, `transformation`) |
| `healthy` | boolean | required | Whether the remote is accessible |

**CompanyFeatures** (association entity)

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `company_id` | UUID | FK to Company |
| `remote_id` | UUID | FK to Feature |

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-FTR-01** | `slug` must be unique across all features |
| **INV-FTR-02** | `remote_uri` must be a valid URL pointing to a Module Federation remote |
| **INV-FTR-03** | `api_uri` must be a valid URL pointing to a NestJS API |
| **INV-FTR-04** | Shell creates routes dynamically — one route per feature in the registry |

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-FTR-01** | FeatureRegistered | CMD-FTR-01 completes | `{ featureId, title, slug }` |
| **EVT-FTR-02** | FeatureUpdated | CMD-FTR-02 completes | `{ featureId, changes }` |
| **EVT-FTR-03** | FeatureDeregistered | CMD-FTR-03 completes | `{ featureId }` |
| **EVT-FTR-04** | FeatureHealthChanged | Health check result | `{ featureId, healthy }` |

---

## 2. Commands

### CMD-FTR-01: Register Feature

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/features` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Input** | `{ title, description, remote_uri, api_uri, slug, healthy }` |
| **Preconditions** | User authenticated; slug is unique (INV-FTR-01) |
| **Postconditions** | New Feature created in registry |
| **Error cases** | 401, 403, 409 (duplicate slug) |
| **Events** | EVT-FTR-01 |

### CMD-FTR-02: Update Feature

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/features/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Input** | Partial `{ title?, description?, remote_uri?, api_uri?, slug?, healthy? }` |
| **Preconditions** | Feature exists |
| **Postconditions** | Feature fields updated |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-FTR-02 |

### CMD-FTR-03: Deregister Feature

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/features/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Input** | Feature ID (path parameter) |
| **Preconditions** | Feature exists |
| **Postconditions** | Feature removed from registry; shell route no longer available |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-FTR-03 |

---

## 3. Queries

### QRY-FTR-01: List Features

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/features` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `tester` |
| **Output** | `Feature[]` |
| **Notes** | Returns all registered features |

### QRY-FTR-02: Get Feature

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/features/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` |
| **Output** | `Feature` |
| **Notes** | 404 if not found |

---

## 4. Frontend State

### Store Pattern: Classic NgRx (Entity Adapter + Functional Effects)

**Library:** `libs/features-state`

### State Shape

```typescript
interface FeaturesState extends EntityState<Feature> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
}
```

### Actions & Effects

| Action | Description |
|--------|-------------|
| `loadFeatures` | Fetch all features from registry |
| `loadFeaturesSuccess` | Store features in entity adapter |
| `createFeature` | Register new feature |
| `updateFeature` | Update feature registration |
| `deleteFeature` | Deregister feature |

### Shell Dynamic Routing

The Dashboard shell application:

1. On initialization, fetches features from `GET /api/features`
2. For each feature, creates a dynamic Angular route:
   ```typescript
   {
     path: feature.slug,
     loadChildren: () => loadRemoteModule({
       type: 'module',
       remoteEntry: `${feature.remote_uri}/remoteEntry.js`,
       exposedModule: './Routes',
     }).then(m => m.ROUTES)
   }
   ```
3. Navigation items are generated from the feature list
4. Health status is displayed alongside each navigation item

### Module Federation Architecture

```
Dashboard Shell (port 4200)
  ├── loadRemoteModule('ingress')        → apps/ingress (port 4202)
  ├── loadRemoteModule('users')          → apps/users (port 4201)
  ├── loadRemoteModule('transformation') → apps/transformation (port 4203)
  ├── loadRemoteModule('reporting')      → apps/reporting (port 4204)
  └── loadRemoteModule('export')         → apps/export (port 4205)
```

Each remote exposes:
```typescript
// apps/{domain}/module-federation.config.ts
{
  name: '{domain}',
  exposes: {
    './Routes': 'apps/{domain}/src/app/remote-entry/entry.routes.ts'
  }
}
```

---

## 5. Acceptance Criteria

### AC-FTR-01: Feature registry

```gherkin
Given the Features API is running
When a client requests GET /api/features
Then the response should contain all registered features
And each feature should have title, slug, remote_uri, api_uri, and healthy status
```

### AC-FTR-02: Dynamic shell routing

```gherkin
Given the Dashboard shell is loaded
And the Features API returns features with slugs "ingress", "transformation", "reporting", "export", "users"
When the shell initialises
Then routes should be created for each feature slug
And the navigation should display links for each feature
When the user clicks "Ingress"
Then the browser should navigate to /ingress
And the Ingress micro-frontend should load via Module Federation
```

### AC-FTR-03: Feature health status

```gherkin
Given a feature "Ingress" is registered with healthy: true
When the user views the navigation
Then the Ingress link should indicate a healthy status
Given the feature is updated to healthy: false
When the navigation refreshes
Then the Ingress link should indicate an unhealthy status
```

### AC-FTR-04: Module Federation loading

```gherkin
Given a feature is registered with remote_uri "http://localhost:4202"
When the shell navigates to the feature's route
Then loadRemoteModule should fetch remoteEntry.js from the remote_uri
And the exposed ./Routes should be loaded as child routes
And the remote application's components should render within the shell
```

### AC-FTR-05: Dashboard home page

```gherkin
Given the user is authenticated
When the user navigates to the dashboard shell
Then the user should see the home page
And the home page should display navigation links to all registered features
```

---

## 6. API Contract Summary

| Method | Path | Guard Roles | Request Body | Response | Spec Ref |
|--------|------|-------------|-------------|----------|----------|
| `POST` | `/api/features` | JWT | `Feature` (partial) | `Feature` | CMD-FTR-01 |
| `GET` | `/api/features` | tester | — | `Feature[]` | QRY-FTR-01 |
| `GET` | `/api/features/:id` | JWT | — | `Feature` | QRY-FTR-02 |
| `PATCH` | `/api/features/:id` | JWT | `Feature` (partial) | `Feature` | CMD-FTR-02 |
| `DELETE` | `/api/features/:id` | JWT | — | `void` | CMD-FTR-03 |
