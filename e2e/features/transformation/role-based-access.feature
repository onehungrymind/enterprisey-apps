@transformation @rbac
Feature: Transformation Role-Based Access Control

  As the system
  I want to enforce role-based access
  So that only authorized users can modify pipelines

  # === ADMIN ACCESS ===

  Scenario: Admin can create pipelines
    Given I am logged in as "admin@example.com"
    And I am on the transformation page
    Then the "New Pipeline" button should be visible
    When I click "New Pipeline"
    Then I should see the pipeline creation form

  Scenario: Admin can manage steps
    Given I am logged in as "admin@example.com"
    And there is a pipeline named "Admin Pipeline"
    When I select "Admin Pipeline"
    Then the "Add Step" button should be visible
    And I should be able to edit existing steps
    And I should be able to delete steps

  Scenario: Admin can run pipelines
    Given I am logged in as "admin@example.com"
    And there is an active pipeline "Runnable Pipeline"
    When I select "Runnable Pipeline"
    Then the "Run" button should be enabled

  Scenario: Admin can delete pipelines
    Given I am logged in as "admin@example.com"
    And there is a pipeline named "Deletable Pipeline"
    When I select "Deletable Pipeline"
    Then the "Delete" button should be visible

  # === ENGINEER ACCESS ===

  Scenario: Engineer can create pipelines
    Given I am logged in as "engineer@example.com"
    And I am on the transformation page
    Then the "New Pipeline" button should be visible

  Scenario: Engineer can manage steps
    Given I am logged in as "engineer@example.com"
    And there is a pipeline named "Engineer Pipeline"
    When I select "Engineer Pipeline"
    Then the "Add Step" button should be visible

  Scenario: Engineer can run pipelines
    Given I am logged in as "engineer@example.com"
    And there is an active pipeline "Engineer Run"
    When I select "Engineer Run"
    Then the "Run" button should be enabled

  # === REGULAR USER ACCESS ===

  @AC-TRN-15
  Scenario: Regular user can view pipelines list
    Given I am logged in as "user@example.com"
    And I am on the transformation page
    Then I should see the pipelines list
    And I should see pipeline names and statuses

  Scenario: Regular user cannot create pipelines
    Given I am logged in as "user@example.com"
    And I am on the transformation page
    Then the "New Pipeline" button should be hidden

  Scenario: Regular user cannot edit pipelines
    Given I am logged in as "user@example.com"
    And there is a pipeline named "Read Only Pipeline"
    When I select "Read Only Pipeline"
    Then the "Edit" button should be hidden
    And the "Delete" button should be hidden

  Scenario: Regular user cannot manage steps
    Given I am logged in as "user@example.com"
    And there is a pipeline with steps
    When I select the pipeline
    Then the "Add Step" button should be hidden
    And step edit controls should be hidden
    And step delete controls should be hidden

  Scenario: Regular user cannot run pipelines
    Given I am logged in as "user@example.com"
    And there is an active pipeline
    When I select the pipeline
    Then the "Run" button should be hidden

  Scenario: Regular user can view run history
    Given I am logged in as "user@example.com"
    And there is a pipeline with run history
    When I select the pipeline
    Then I should be able to view run history
    But I should not be able to cancel runs

  Scenario: Regular user can view preview
    Given I am logged in as "user@example.com"
    And there is a pipeline with steps
    When I select the pipeline
    Then I should be able to view the preview

  # === API LEVEL ENFORCEMENT ===

  @api
  Scenario: Unauthorized POST to pipelines endpoint returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/pipelines
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized POST to steps endpoint returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/steps
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized run request returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/pipelines/:id/run
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized step reorder returns 403
    Given I am logged in as "user@example.com"
    When I attempt to PATCH to /api/steps/:id/reorder
    Then the response should be 403 Forbidden
