@reporting @rbac
Feature: Reporting Role-Based Access Control

  As the system
  I want to enforce role-based access
  So that only authorized users can manage dashboards

  # === ADMIN ACCESS ===

  @AC-RPT-13
  Scenario: Admin can view all dashboards
    Given I am logged in as "admin@example.com"
    And I am on the reporting page
    Then I should see public dashboards
    And I should see my own dashboards

  Scenario: Admin can create dashboards
    Given I am logged in as "admin@example.com"
    And I am on the reporting page
    Then the "New Dashboard" button should be visible
    When I click "New Dashboard"
    Then I should see the dashboard creation form

  Scenario: Admin can edit any dashboard
    Given I am logged in as "admin@example.com"
    And there is a dashboard created by another user
    When I select the dashboard
    Then the "Edit" button should be visible

  Scenario: Admin can delete any dashboard
    Given I am logged in as "admin@example.com"
    And there is a dashboard created by another user
    When I select the dashboard
    Then the "Delete" button should be visible

  Scenario: Admin can manage widgets
    Given I am logged in as "admin@example.com"
    And I have selected a dashboard
    Then the "Add Widget" button should be visible
    And I should be able to edit widgets
    And I should be able to delete widgets

  Scenario: Admin can manage queries
    Given I am logged in as "admin@example.com"
    And I am on the queries section
    Then I should be able to create queries
    And I should be able to edit queries
    And I should be able to delete queries

  # === ANALYST ACCESS ===

  Scenario: Analyst can create dashboards
    Given I am logged in as "analyst@example.com"
    And I am on the reporting page
    Then the "New Dashboard" button should be visible

  Scenario: Analyst can edit own dashboards
    Given I am logged in as "analyst@example.com"
    And I have created a dashboard "My Dashboard"
    When I select "My Dashboard"
    Then the "Edit" button should be visible

  Scenario: Analyst cannot edit others' private dashboards
    Given I am logged in as "analyst@example.com"
    And user "other@example.com" has a private dashboard
    When I try to access that dashboard
    Then I should see access denied

  Scenario: Analyst can view public dashboards
    Given I am logged in as "analyst@example.com"
    And there are public dashboards
    When I view the dashboards list
    Then I should see public dashboards

  # === REGULAR USER ACCESS ===

  @AC-RPT-13
  Scenario: Regular user can view public dashboards
    Given I am logged in as "user@example.com"
    And I am on the reporting page
    Then I should see public dashboards

  Scenario: Regular user cannot create dashboards
    Given I am logged in as "user@example.com"
    And I am on the reporting page
    Then the "New Dashboard" button should be hidden

  Scenario: Regular user cannot edit dashboards
    Given I am logged in as "user@example.com"
    And there is a public dashboard
    When I select the dashboard
    Then the "Edit" button should be hidden

  Scenario: Regular user cannot delete dashboards
    Given I am logged in as "user@example.com"
    And there is a public dashboard
    When I select the dashboard
    Then the "Delete" button should be hidden

  Scenario: Regular user cannot manage widgets
    Given I am logged in as "user@example.com"
    And I have selected a public dashboard
    Then the "Add Widget" button should be hidden
    And widget edit controls should be hidden
    And widget delete controls should be hidden

  Scenario: Regular user can view widget data
    Given I am logged in as "user@example.com"
    And I have selected a public dashboard
    Then I should see widget data
    And charts should render correctly

  Scenario: Regular user can apply filters
    Given I am logged in as "user@example.com"
    And I have selected a dashboard with filters
    Then I should be able to apply date filters
    And widgets should update

  Scenario: Regular user cannot manage queries
    Given I am logged in as "user@example.com"
    When I navigate to the queries section
    Then the "New Query" button should be hidden

  # === DASHBOARD OWNER PERMISSIONS ===

  @AC-RPT-13
  Scenario: Owner can edit their private dashboard
    Given I am logged in as "creator@example.com"
    And I created a private dashboard "My Private Dashboard"
    When I select "My Private Dashboard"
    Then I should be able to edit the dashboard

  Scenario: Owner can delete their dashboard
    Given I am logged in as "creator@example.com"
    And I created a dashboard "My Dashboard"
    When I select "My Dashboard"
    Then I should be able to delete the dashboard

  Scenario: Owner can make dashboard public/private
    Given I am logged in as "creator@example.com"
    And I created a private dashboard
    When I edit the dashboard
    Then I should be able to change visibility to public

  Scenario: Non-owner cannot modify private dashboard
    Given I am logged in as "user@example.com"
    And "other@example.com" created a private dashboard
    Then I should not see that dashboard in my list

  # === API LEVEL ENFORCEMENT ===

  @api
  Scenario: Unauthorized POST to dashboards returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/dashboards
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized DELETE to dashboards returns 403
    Given I am logged in as "user@example.com"
    When I attempt to DELETE to /api/dashboards/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized POST to widgets returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/dashboards/:id/widgets
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized POST to queries returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/queries
    Then the response should be 403 Forbidden

  @api
  Scenario: Authorized user can access dashboard API
    Given I am logged in as "admin@example.com"
    When I attempt to GET /api/dashboards
    Then the response should be 200 OK

  # === UNAUTHENTICATED ACCESS ===

  @security
  Scenario: Unauthenticated user redirected to login
    Given I am not logged in
    When I try to access the reporting page
    Then I should be redirected to the login page

  @security
  Scenario: Unauthenticated API request returns 401
    Given I am not logged in
    When I attempt to GET /api/dashboards
    Then the response should be 401 Unauthorized
