@export @rbac
Feature: Export Role-Based Access Control

  As the system
  I want to enforce role-based access
  So that only authorized users can create export jobs

  # === ADMIN ACCESS ===

  Scenario: Admin can view export page
    Given I am logged in as "admin@example.com"
    When I navigate to the export page
    Then I should see the export page

  Scenario: Admin can create export jobs
    Given I am logged in as "admin@example.com"
    And I am on the export page
    Then the create job form should be visible
    And I should be able to start exports

  Scenario: Admin can cancel jobs
    Given I am logged in as "admin@example.com"
    And there is a processing job
    Then I should see the cancel button
    And I should be able to cancel the job

  Scenario: Admin can delete jobs
    Given I am logged in as "admin@example.com"
    And there is a completed job
    Then I should see the delete button
    And I should be able to delete the job

  Scenario: Admin can download exports
    Given I am logged in as "admin@example.com"
    And there is a completed job
    Then I should see the download button
    And I should be able to download the file

  # === ENGINEER ACCESS ===

  Scenario: Engineer can view export page
    Given I am logged in as "engineer@example.com"
    When I navigate to the export page
    Then I should see the export page

  Scenario: Engineer can create export jobs
    Given I am logged in as "engineer@example.com"
    And I am on the export page
    Then the create job form should be visible
    And I should be able to start exports

  Scenario: Engineer can cancel jobs
    Given I am logged in as "engineer@example.com"
    And there is a processing job
    Then I should see the cancel button

  Scenario: Engineer can delete jobs
    Given I am logged in as "engineer@example.com"
    And there is a completed job
    Then I should see the delete button

  Scenario: Engineer can download exports
    Given I am logged in as "engineer@example.com"
    And there is a completed job
    Then I should see the download button

  # === REGULAR USER ACCESS ===

  @AC-EXP-10
  Scenario: Regular user can view job list
    Given I am logged in as "user@example.com"
    And I am on the export page
    Then I should see the job list
    And I should see active jobs
    And I should see job history

  @AC-EXP-10
  Scenario: Regular user cannot create jobs
    Given I am logged in as "user@example.com"
    And I am on the export page
    Then the create job form should be hidden or disabled

  @AC-EXP-10
  Scenario: Regular user cannot cancel jobs
    Given I am logged in as "user@example.com"
    And there is a processing job
    Then the cancel button should be hidden

  @AC-EXP-10
  Scenario: Regular user cannot delete jobs
    Given I am logged in as "user@example.com"
    And there is a completed job
    Then the delete button should be hidden

  Scenario: Regular user can download their own exports
    Given I am logged in as "user@example.com"
    And there is a completed job I created
    Then I should be able to download the file

  Scenario: Regular user can view job progress
    Given I am logged in as "user@example.com"
    And there is a processing job
    Then I should see the progress bar
    And I should see the status

  # === APPRENTICE ACCESS ===

  Scenario: Apprentice has limited access
    Given I am logged in as "apprentice@example.com"
    And I am on the export page
    Then the create job form should be hidden
    And the cancel buttons should be hidden
    And the delete buttons should be hidden

  # === API LEVEL ENFORCEMENT ===

  @api
  Scenario: Unauthorized POST to jobs returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/jobs
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized cancel request returns 403
    Given I am logged in as "user@example.com"
    When I attempt to POST to /api/jobs/:id/cancel
    Then the response should be 403 Forbidden

  @api
  Scenario: Unauthorized DELETE to jobs returns 403
    Given I am logged in as "user@example.com"
    When I attempt to DELETE to /api/jobs/:id
    Then the response should be 403 Forbidden

  @api
  Scenario: Authorized user can read jobs
    Given I am logged in as "user@example.com"
    When I attempt to GET /api/jobs
    Then the response should be 200 OK

  @api
  Scenario: Admin can access all job endpoints
    Given I am logged in as "admin@example.com"
    When I attempt to POST to /api/jobs
    Then the response should be 201 Created

  # === UNAUTHENTICATED ACCESS ===

  @security
  Scenario: Unauthenticated user redirected to login
    Given I am not logged in
    When I try to access the export page
    Then I should be redirected to the login page

  @security
  Scenario: Unauthenticated API request returns 401
    Given I am not logged in
    When I attempt to GET /api/jobs
    Then the response should be 401 Unauthorized
