# Users & Auth — Identity & Access Control

## 1. Domain Model

### 1.1 Aggregates

**User** (aggregate root)
- Identity: `id: UUID`
- References: `company_id` FK to Company
- Enforces invariants on authentication, password security, and role assignment

**Company** (aggregate root)
- Identity: `id: UUID`
- Referenced by User.company_id

### 1.2 Entities & Value Objects

**User** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `firstName` | string | required | First name |
| `lastName` | string | required | Last name |
| `email` | string | required | Unique email address (login identifier) |
| `password` | string | required | bcryptjs-hashed password |
| `role` | UserRoleEnum | required | `admin`, `mentor`, `apprentice`, `user` |
| `company_id` | UUID | required | FK to Company |

**Company** (entity)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | UUID | auto-generated | PK |
| `name` | string | required | Company name |
| `description` | string | required | Description |

**UserRoleEnum** (enumeration):

| Value | Description | Access Level |
|-------|-------------|-------------|
| `admin` | Full system administrator | All operations across all domains |
| `mentor` | Senior user with oversight capabilities | Extended read access |
| `apprentice` | Junior user with limited access | Basic read access |
| `user` | Standard user | Read access to public resources |

**Domain-specific guard roles** (used in `@Roles()` decorators):

| Role | Used In | Grants |
|------|---------|--------|
| `engineer` | Ingress, Transformation, Export | Write access to domain resources |
| `analyst` | Reporting | Dashboard and query management |
| `tester` | Features, Users | Access to test and list features/users |

### Authentication Flow

```
1. Client sends POST /api/users/auth/login { email, password }
2. Backend validates credentials:
   a. Find user by email
   b. Compare password with bcryptjs hash
   c. If valid: generate JWT with payload { id, email, role }
   d. Return { access_token, user }
3. Client stores JWT in localStorage/memory
4. Subsequent requests include Authorization: Bearer <token>
5. JwtAuthGuard on each backend:
   a. Extracts token from Authorization header
   b. Calls GET http://localhost:3500/api/users/auth/validate with the token
   c. Users API validates JWT and returns user object
   d. Guard sets request.user = validated user
6. RolesGuard (optional):
   a. Reads @Roles() metadata from handler
   b. Checks if request.user.role matches any required role
   c. Returns true if no roles specified (open to any authenticated user)
```

### JWT Token Payload

```typescript
{
  id: string;       // User UUID
  email: string;    // User email
  role: string;     // User role (admin, mentor, apprentice, user)
  iat: number;      // Issued at timestamp
  exp: number;      // Expiration timestamp
}
```

### 1.3 Invariants

| ID | Rule |
|----|------|
| **INV-USR-01** | Email must be unique across all users |
| **INV-USR-02** | Password must be hashed with bcryptjs before storage — plain text never persisted |
| **INV-USR-03** | `role` must be a valid UserRoleEnum value: `admin`, `mentor`, `apprentice`, `user` |
| **INV-USR-04** | A valid JWT is required for all API operations (except login) |
| **INV-USR-05** | `company_id` must reference an existing Company |
| **INV-USR-06** | Only users with `admin` role can create, update, or delete other users |

### 1.4 Domain Events

| ID | Event | Trigger | Payload |
|----|-------|---------|---------|
| **EVT-USR-01** | UserLoggedIn | CMD-USR-01 succeeds | `{ userId, email }` |
| **EVT-USR-02** | UserLoginFailed | CMD-USR-01 fails | `{ email, reason }` |
| **EVT-USR-03** | TokenValidated | QRY-USR-01 succeeds | `{ userId }` |
| **EVT-USR-04** | TokenRejected | QRY-USR-01 fails | `{ reason }` |
| **EVT-USR-05** | UserCreated | CMD-USR-02 completes | `{ userId, email, role }` |
| **EVT-USR-06** | UserUpdated | CMD-USR-03 completes | `{ userId, changes }` |
| **EVT-USR-07** | UserDeleted | CMD-USR-04 completes | `{ userId }` |

---

## 2. Commands

### CMD-USR-01: Login

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/users/auth/login` |
| **Guard** | None (public endpoint) |
| **Input** | `{ email, password }` |
| **Preconditions** | User with given email exists; password matches bcryptjs hash |
| **Postconditions** | JWT token generated and returned along with user object (password excluded) |
| **Error cases** | 401 (invalid credentials) |
| **Events** | EVT-USR-01 or EVT-USR-02 |

### CMD-USR-02: Create User

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /api/users` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` |
| **Input** | `{ firstName, lastName, email, password, role, company_id }` |
| **Preconditions** | Authenticated as admin; email is unique (INV-USR-01) |
| **Postconditions** | New User created with password hashed via bcryptjs |
| **Error cases** | 401, 403, 409 (duplicate email) |
| **Events** | EVT-USR-05 |

### CMD-USR-03: Update User

| Field | Value |
|-------|-------|
| **Endpoint** | `PATCH /api/users/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` |
| **Input** | Partial `{ firstName?, lastName?, email?, password?, role?, company_id? }` |
| **Preconditions** | User exists; authenticated as admin |
| **Postconditions** | User fields updated; if password provided, it is re-hashed |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-USR-06 |

### CMD-USR-04: Delete User

| Field | Value |
|-------|-------|
| **Endpoint** | `DELETE /api/users/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` |
| **Input** | User ID (path parameter) |
| **Preconditions** | User exists; authenticated as admin |
| **Postconditions** | User removed from database |
| **Error cases** | 404, 401, 403 |
| **Events** | EVT-USR-07 |

---

## 3. Queries

### QRY-USR-01: Validate Token

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/users/auth/validate` |
| **Guard** | `JwtAuthGuard` (local — Passport JWT strategy on Users service) |
| **Output** | `User` (without password) |
| **Notes** | Called by JwtAuthGuard in all other backend services to validate tokens. This is the central token validation endpoint. |

### QRY-USR-02: List Users

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/users` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` or `tester` |
| **Output** | `User[]` |
| **Notes** | Returns all users |

### QRY-USR-03: Get User

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/users/:id` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `user` role (any authenticated) |
| **Output** | `User` |
| **Notes** | 404 if not found |

### QRY-USR-04: Find User by Email

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /api/users/email/:email` |
| **Guard** | `JwtAuthGuard`, `RolesGuard` — requires `admin` |
| **Output** | `User` |
| **Notes** | 404 if not found; used for admin user lookup |

---

## 4. Frontend State

### Store Pattern: Classic NgRx (Entity Adapter + Functional Effects)

**Library:** `libs/users-state`

### State Shape

```typescript
interface UsersState extends EntityState<User> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
}
```

### Actions

| Action | Payload | Trigger |
|--------|---------|---------|
| `loadUsers` | — | Component init |
| `loadUsersSuccess` | `User[]` | API response |
| `loadUsersFailure` | `{ error }` | API error |
| `createUser` | `User` | Form submit |
| `createUserSuccess` | `User` | API response |
| `updateUser` | `User` | Form submit |
| `updateUserSuccess` | `User` | API response |
| `deleteUser` | `User` | Delete button click |
| `deleteUserSuccess` | `User` | API response |
| `selectUser` | `{ id }` | Row selection |

### Effects

| Effect | Description |
|--------|-------------|
| `loadUsers$` | `loadUsers` → `GET /api/users` → `loadUsersSuccess` |
| `createUser$` | `createUser` → `POST /api/users` → `createUserSuccess` |
| `updateUser$` | `updateUser` → `PATCH /api/users/:id` → `updateUserSuccess` |
| `deleteUser$` | `deleteUser` → `DELETE /api/users/:id` → `deleteUserSuccess` |

### Selectors

| Selector | Returns |
|----------|---------|
| `selectAllUsers` | `User[]` |
| `selectSelectedUser` | `User | undefined` |
| `selectUsersLoaded` | `boolean` |
| `selectUsersError` | `string | null` |

---

## 5. Acceptance Criteria

### AC-USR-01: Login with valid credentials

```gherkin
Given the user is on the login page
When the user enters email "admin@test.com" and password "admin"
And submits the login form
Then the user should receive a JWT access token
And be redirected to the dashboard
```

### AC-USR-02: Login with invalid credentials

```gherkin
Given the user is on the login page
When the user enters email "admin@test.com" and an incorrect password
And submits the login form
Then the user should see an error message
And should not be redirected
```

### AC-USR-03: Token validation

```gherkin
Given a user has a valid JWT token
When the token is sent to GET /api/users/auth/validate
Then the response should contain the user object (without password)
And the HTTP status should be 200
```

### AC-USR-04: Token rejection

```gherkin
Given a user has an expired or invalid JWT token
When the token is sent to GET /api/users/auth/validate
Then the response should be 401 Unauthorized
```

### AC-USR-05: User CRUD by admin

```gherkin
Given a user is authenticated with role "admin"
When the admin creates a new user with email "new@test.com" and role "user"
Then the user should appear in the users list
When the admin updates the user's role to "mentor"
Then the role change should be reflected
When the admin deletes the user
Then the user should no longer appear in the list
```

### AC-USR-06: Role enforcement across domains

```gherkin
Given a user is authenticated with role "user"
When the user attempts to POST /api/sources (requires admin or engineer)
Then the response should be 403 Forbidden
When a user with role "admin" makes the same request
Then the response should be 201 Created
```

### AC-USR-07: Password security

```gherkin
Given a new user is created with password "plaintext123"
When the user record is stored in the database
Then the password field should contain a bcryptjs hash (not plain text)
And the hash should validate against the original password
```

### AC-USR-08: Logout

```gherkin
Given a user is authenticated and on the dashboard
When the user clicks "Logout"
Then the JWT token should be removed from storage
And the user should be redirected to the login page
And subsequent API requests should return 401
```

---

## 6. API Contract Summary

| Method | Path | Guard Roles | Request Body | Response | Spec Ref |
|--------|------|-------------|-------------|----------|----------|
| `POST` | `/api/users/auth/login` | none (public) | `{ email, password }` | `{ access_token, user }` | CMD-USR-01 |
| `GET` | `/api/users/auth/validate` | JWT (Passport) | — | `User` | QRY-USR-01 |
| `POST` | `/api/users` | admin | `User` | `User` | CMD-USR-02 |
| `GET` | `/api/users` | admin, tester | — | `User[]` | QRY-USR-02 |
| `GET` | `/api/users/:id` | user | — | `User` | QRY-USR-03 |
| `GET` | `/api/users/email/:email` | admin | — | `User` | QRY-USR-04 |
| `PATCH` | `/api/users/:id` | admin | `User` (partial) | `User` | CMD-USR-03 |
| `DELETE` | `/api/users/:id` | admin | — | `void` | CMD-USR-04 |
