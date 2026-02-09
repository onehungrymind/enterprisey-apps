@users @rbac
Feature: Users Role-Based Access Control

  As the system
  I want to enforce role-based access
  So that only admins can manage users

  # === ADMIN ACCESS ===

  @AC-USR-05
  Scenario: Admin can view users list
    Given I am logged in as "admin@example.com"
    And I am on the users page
    Then I should see the users list

  @AC-USR-05
  Scenario: Admin can create users
    Given I am logged in as "admin@example.com"
    And I am on the users page
    Then the "Invite User" button should be visible
    When I click "Invite User"
    Then I should see the user creation form

  @AC-USR-05
  Scenario: Admin can edit any user
    Given I am logged in as "admin@example.com"
    And there is another user "Other User"
    When I select "Other User"
    Then the "Edit" button should be visible

  @AC-USR-05
  Scenario: Admin can delete users
    Given I am logged in as "admin@example.com"
    And there is a user "Delete Target"
    When I select "Delete Target"
    Then the "Delete" button should be visible

  Scenario: Admin can view companies
    Given I am logged in as "admin@example.com"
    And I am on the users page
    When I click "Companies"
    Then I should see the companies list

  Scenario: Admin can create companies
    Given I am logged in as "admin@example.com"
    And I am on the companies tab
    Then the "Add Company" button should be visible

  Scenario: Admin can search users by email
    Given I am logged in as "admin@example.com"
    When I navigate to GET /api/users/email/test@example.com
    Then the response should be 200 OK

  # === TESTER ACCESS ===

  Scenario: Tester can view users list
    Given I am logged in as "tester@example.com"
    And I am on the users page
    Then I should see the users list

  Scenario: Tester cannot create users
    Given I am logged in as "tester@example.com"
    And I am on the users page
    Then the "Invite User" button should be hidden

  Scenario: Tester cannot edit users
    Given I am logged in as "tester@example.com"
    And there is a user "View Only User"
    When I select "View Only User"
    Then the "Edit" button should be hidden

  Scenario: Tester cannot delete users
    Given I am logged in as "tester@example.com"
    And there is a user "Cannot Delete"
    When I select "Cannot Delete"
    Then the "Delete" button should be hidden

  # === MENTOR ACCESS ===

  Scenario: Mentor can view own profile
    Given I am logged in as "mentor@example.com"
    Then I should be able to view my profile

  Scenario: Mentor cannot manage other users
    Given I am logged in as "mentor@example.com"
    When I try to access the users management page
    Then I should see access denied or limited view

  # === APPRENTICE ACCESS ===

  Scenario: Apprentice has limited user view
    Given I am logged in as "apprentice@example.com"
    Then I should have limited access to user management

  # === REGULAR USER ACCESS ===

  @INV-USR-06
  Scenario: Regular user cannot access user management
    Given I am logged in as "user@example.com"
    When I try to access the users page
    Then I should see access denied or the users management should be hidden

  Scenario: Regular user can view own profile
    Given I am logged in as "user@example.com"
    Then I should be able to view my own profile

  Scenario: Regular user cannot view other users
    Given I am logged in as "user@example.com"
    When I try to view another user's profile
    Then I should see access denied

  Scenario: Regular user can update own profile
    Given I am logged in as "user@example.com"
    When I edit my own profile
    Then I should be able to update my name
    But I should not be able to change my role

  # === API LEVEL ENFORCEMENT ===

  @api
  Scenario: Unauthorized POST to users returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/users
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized PATCH to users returns 403
    Given I am logged in as "user@example.com"
    When I attempt to PATCH to /api/users/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized DELETE to users returns 403
    Given I am logged in as "user@example.com"
    When I attempt to DELETE to /api/users/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized email lookup returns 403
    Given I am logged in as "user@example.com"
    When I attempt to GET /api/users/email/test@example.com
    Then the response should be 403 Forbidden

  @api @AC-USR-06
  Scenario: Role enforcement across domains
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/sources
    Then the response should be 403 Forbidden

  @api @AC-USR-06
  Scenario: Admin can access protected endpoints
    Given I am logged in as "admin@example.com"
    When I attempt to POST to /api/sources
    Then the response should be 201 Created

  # === UNAUTHENTICATED ACCESS ===

  @security
  Scenario: Unauthenticated user redirected to login
    Given I am not logged in
    When I try to access the users page
    Then I should be redirected to the login page

  @security
  Scenario: Unauthenticated API request returns 401
    Given I am not logged in
    When I attempt to GET /api/users
    Then the response should be 401 Unauthorized
