@transformation @crud
Feature: Pipeline CRUD Operations

  As a data engineer
  I want to manage data transformation pipelines
  So that I can process and transform ingested data

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the transformation page

  # === SMOKE TESTS ===

  @smoke @AC-TRN-01
  Scenario: View pipelines list
    Then I should see the pipelines list
    And each pipeline should display its name, status, and step count
    And each pipeline should display its source reference

  @smoke
  Scenario: Pipelines list shows status indicators
    Given there are pipelines with different statuses
    Then draft pipelines should show a draft indicator
    And active pipelines should show an active indicator
    And error pipelines should show an error indicator

  # === CREATE PIPELINE ===

  @AC-TRN-02
  Scenario: Create a new pipeline with valid data
    When I click "New Pipeline"
    And I fill in name "Customer ETL Pipeline"
    And I fill in description "Transform customer data for analytics"
    And I select source "Production DB"
    And I click save
    Then I should see "Customer ETL Pipeline" in the pipelines list
    And the pipeline status should be "draft"
    And the step count should be 0

  Scenario: Create pipeline with minimum required fields
    When I click "New Pipeline"
    And I fill in name "Minimal Pipeline"
    And I select source "Any Source"
    And I click save
    Then I should see "Minimal Pipeline" in the pipelines list

  Scenario: Create pipeline from source selection
    Given there is a connected source "Ready Source"
    When I create a pipeline using "Ready Source"
    Then the pipeline should reference "Ready Source"
    And I should be on the pipeline editor

  # === UPDATE PIPELINE ===

  @AC-TRN-03
  Scenario: Update pipeline name
    Given there is a pipeline named "Old Pipeline Name"
    When I select "Old Pipeline Name"
    And I click edit
    And I change the name to "Updated Pipeline Name"
    And I click save
    Then I should see "Updated Pipeline Name" in the pipelines list
    And I should not see "Old Pipeline Name" in the pipelines list

  Scenario: Update pipeline description
    Given there is a pipeline named "Descriptive Pipeline"
    When I select "Descriptive Pipeline"
    And I click edit
    And I change the description to "New detailed description"
    And I click save
    Then the pipeline description should be "New detailed description"

  Scenario: Update pipeline source
    Given there is a pipeline using source "Old Source"
    And there is another source "New Source"
    When I change the pipeline source to "New Source"
    And I click save
    Then the pipeline should reference "New Source"
    And the step configurations should be validated

  Scenario: Update pipeline status to active
    Given there is a draft pipeline "Ready Pipeline" with steps
    When I select "Ready Pipeline"
    And I change the status to "active"
    And I click save
    Then the pipeline status should be "active"

  Scenario: Pause an active pipeline
    Given there is an active pipeline "Running Pipeline"
    When I select "Running Pipeline"
    And I change the status to "paused"
    And I click save
    Then the pipeline status should be "paused"

  # === DELETE PIPELINE ===

  @AC-TRN-04
  Scenario: Delete a pipeline
    Given there is a pipeline named "Delete Me Pipeline"
    When I select "Delete Me Pipeline"
    And I click delete
    And I confirm the deletion
    Then I should not see "Delete Me Pipeline" in the pipelines list

  Scenario: Delete pipeline removes associated steps
    Given there is a pipeline "Pipeline With Steps" containing 3 steps
    When I delete the pipeline
    And I confirm the deletion
    Then the pipeline should be removed
    And all associated steps should be removed

  Scenario: Delete pipeline removes run history
    Given there is a pipeline "Pipeline With Runs" with run history
    When I delete the pipeline
    And I confirm the deletion
    Then the pipeline should be removed
    And all associated runs should be removed

  Scenario: Cancel pipeline deletion
    Given there is a pipeline named "Keep This Pipeline"
    When I select "Keep This Pipeline"
    And I click delete
    And I cancel the dialog
    Then I should see "Keep This Pipeline" in the pipelines list

  # === VALIDATION ===

  @validation
  Scenario: Cannot create pipeline without name
    When I click "New Pipeline"
    And I select source "Any Source"
    And I click save
    Then I should see a validation error for name
    And the pipeline should not be created

  @validation
  Scenario: Cannot create pipeline without source
    When I click "New Pipeline"
    And I fill in name "Sourceless Pipeline"
    And I click save
    Then I should see a validation error for source
    And the pipeline should not be created

  @validation
  Scenario: Pipeline name must be unique
    Given there is a pipeline named "Existing Pipeline"
    When I click "New Pipeline"
    And I fill in name "Existing Pipeline"
    And I select source "Any Source"
    And I click save
    Then I should see an error about duplicate name

  @validation
  Scenario: Source must be valid Ingress source
    When I try to create a pipeline with invalid sourceId
    Then I should see an error about invalid source

  # === STATUS TRANSITIONS ===

  @status
  Scenario: Draft pipeline can become active
    Given there is a draft pipeline with valid configuration
    When I activate the pipeline
    Then the status should change to "active"

  @status
  Scenario: Active pipeline can be paused
    Given there is an active pipeline
    When I pause the pipeline
    Then the status should change to "paused"

  @status
  Scenario: Paused pipeline can be reactivated
    Given there is a paused pipeline
    When I activate the pipeline
    Then the status should change to "active"

  @status
  Scenario: Failed run sets pipeline to error status
    Given there is an active pipeline
    When a pipeline run fails
    Then the pipeline status should change to "error"

  # === FILTERING AND SEARCH ===

  @filtering
  Scenario: Filter pipelines by status
    Given there are pipelines with status "draft" and "active"
    When I filter by status "active"
    Then I should only see active pipelines

  @filtering
  Scenario: Filter pipelines by source
    Given there are pipelines from different sources
    When I filter by source "Production DB"
    Then I should only see pipelines using "Production DB"

  @search
  Scenario: Search pipelines by name
    Given there are pipelines "Sales ETL" and "Customer ETL"
    When I search for "Sales"
    Then I should see "Sales ETL"
    And I should not see "Customer ETL"

  # === EMPTY STATE ===

  @display
  Scenario: Empty state when no pipelines exist
    Given there are no pipelines
    Then I should see an empty state message
    And I should see a "Create your first pipeline" button
