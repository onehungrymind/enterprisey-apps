@ingress @rbac
Feature: Ingress Role-Based Access Control

  As the system
  I want to enforce role-based access
  So that only authorized users can modify data sources

  # === ADMIN ACCESS ===

  @AC-ING-13
  Scenario: Admin can create sources
    Given I am logged in as "admin@example.com"
    And I am on the ingress page
    Then the "New Data Source" button should be visible
    When I click "New Data Source"
    Then I should see the source creation form

  Scenario: Admin can edit sources
    Given I am logged in as "admin@example.com"
    And there is a source named "Editable Source"
    When I select "Editable Source"
    Then the "Configure" button should be visible
    And the "Delete" button should be visible

  Scenario: Admin can test connections
    Given I am logged in as "admin@example.com"
    And there is a source named "Testable Source"
    When I select "Testable Source"
    Then the "Test Connection" button should be enabled

  Scenario: Admin can sync sources
    Given I am logged in as "admin@example.com"
    And there is a connected source named "Syncable Source"
    When I select "Syncable Source"
    Then the "Sync Now" button should be enabled

  Scenario: Admin can delete sources
    Given I am logged in as "admin@example.com"
    And there is a source named "Deletable Source"
    When I select "Deletable Source"
    And I click delete
    Then I should see the delete confirmation dialog

  # === ENGINEER ACCESS ===

  Scenario: Engineer can create sources
    Given I am logged in as "engineer@example.com"
    And I am on the ingress page
    Then the "New Data Source" button should be visible

  Scenario: Engineer can edit sources
    Given I am logged in as "engineer@example.com"
    And there is a source named "Editable Source"
    When I select "Editable Source"
    Then the "Configure" button should be visible

  Scenario: Engineer can test connections
    Given I am logged in as "engineer@example.com"
    And there is a source named "Testable Source"
    When I select "Testable Source"
    Then the "Test Connection" button should be enabled

  Scenario: Engineer can sync sources
    Given I am logged in as "engineer@example.com"
    And there is a connected source named "Syncable Source"
    When I select "Syncable Source"
    Then the "Sync Now" button should be enabled

  # === REGULAR USER ACCESS ===

  @AC-ING-13
  Scenario: Regular user can view sources list
    Given I am logged in as "user@example.com"
    And I am on the ingress page
    Then I should see the sources list
    And I should see source names and types

  Scenario: Regular user cannot create sources
    Given I am logged in as "user@example.com"
    And I am on the ingress page
    Then the "New Data Source" button should be hidden

  Scenario: Regular user cannot edit sources
    Given I am logged in as "user@example.com"
    And there is a source named "Read Only Source"
    When I select "Read Only Source"
    Then the "Configure" button should be hidden
    And the "Delete" button should be hidden

  Scenario: Regular user cannot test connections
    Given I am logged in as "user@example.com"
    And there is a source named "View Only Source"
    When I select "View Only Source"
    Then the "Test Connection" button should be hidden

  Scenario: Regular user cannot sync sources
    Given I am logged in as "user@example.com"
    And there is a source named "View Only Source"
    When I select "View Only Source"
    Then the "Sync Now" button should be hidden

  Scenario: Regular user can view schema
    Given I am logged in as "user@example.com"
    And there is a synced source "Schema Source"
    When I select "Schema Source"
    Then I should be able to view the schema
    And I should not be able to modify the schema

  # === API LEVEL ENFORCEMENT ===

  @api
  Scenario: Unauthorized POST to sources endpoint returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/sources
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized PATCH to sources endpoint returns 403
    Given I am logged in as "user@example.com"
    When I attempt to PATCH to /api/sources/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized DELETE to sources endpoint returns 403
    Given I am logged in as "user@example.com"
    When I attempt to DELETE to /api/sources/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized test-connection returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/sources/:id/test-connection
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized sync returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/sources/:id/sync
    Then the response should be 403 Forbidden
