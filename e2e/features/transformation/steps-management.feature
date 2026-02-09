@transformation @steps
Feature: Pipeline Steps Management

  As a data engineer
  I want to manage transformation steps within pipelines
  So that I can define how data is processed

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the transformation page
    And there is a pipeline named "Test Pipeline"
    And I have selected "Test Pipeline"

  # === ADD STEPS ===

  @AC-TRN-05
  Scenario: Add a filter step
    When I click "Add Step"
    And I select step type "filter"
    And I configure the filter with field "status" operator "eq" value "active"
    And I click save step
    Then I should see the filter step in the pipeline
    And the step should display "Filter: status = active"

  Scenario: Add a map step
    When I click "Add Step"
    And I select step type "map"
    And I add a mapping from "firstName" to "first_name"
    And I add a mapping from "lastName" to "last_name"
    And I click save step
    Then I should see the map step in the pipeline
    And the step should show 2 field mappings

  Scenario: Add an aggregate step
    When I click "Add Step"
    And I select step type "aggregate"
    And I add group by field "region"
    And I add metric "revenue" with function "sum" as "total_revenue"
    And I click save step
    Then I should see the aggregate step in the pipeline

  Scenario: Add a join step
    Given there is another source "Lookup Table"
    When I click "Add Step"
    And I select step type "join"
    And I select target source "Lookup Table"
    And I configure join on "customer_id"
    And I select join type "left"
    And I click save step
    Then I should see the join step in the pipeline

  Scenario: Add a sort step
    When I click "Add Step"
    And I select step type "sort"
    And I add sort field "created_at" with direction "descending"
    And I click save step
    Then I should see the sort step in the pipeline

  Scenario: Add a deduplicate step
    When I click "Add Step"
    And I select step type "deduplicate"
    And I select key fields "email" and "phone"
    And I click save step
    Then I should see the deduplicate step in the pipeline

  Scenario: Add step at specific position
    Given the pipeline has steps at orders 0, 1
    When I add a step at position 1
    Then the new step should be at order 1
    And the previous step 1 should now be at order 2

  # === UPDATE STEPS ===

  @AC-TRN-06
  Scenario: Update filter step configuration
    Given the pipeline has a filter step
    When I select the filter step
    And I click edit
    And I change the filter value to "inactive"
    And I click save step
    Then the filter should show "status = inactive"

  Scenario: Update map step with expression
    Given the pipeline has a map step
    When I select the map step
    And I click edit
    And I add expression mapping "fullName" = "firstName + ' ' + lastName"
    And I click save step
    Then the map step should include the expression mapping

  Scenario: Update aggregate step metrics
    Given the pipeline has an aggregate step with one metric
    When I select the aggregate step
    And I click edit
    And I add another metric "count" with function "count" as "record_count"
    And I click save step
    Then the aggregate step should show 2 metrics

  # === DELETE STEPS ===

  @AC-TRN-07
  Scenario: Delete a step and renumber remaining steps
    Given the pipeline has steps at orders 0, 1, 2
    When I select the step at order 1
    And I delete the step
    And I confirm the deletion
    Then the step should be removed
    And remaining steps should be at orders 0, 1

  Scenario: Delete first step renumbers all following steps
    Given the pipeline has steps Filter(0), Map(1), Sort(2)
    When I delete the Filter step at order 0
    Then Map should be at order 0
    And Sort should be at order 1

  Scenario: Delete last step does not affect others
    Given the pipeline has steps Filter(0), Map(1)
    When I delete the Map step at order 1
    Then Filter should remain at order 0

  Scenario: Cancel step deletion
    Given the pipeline has a step "Important Step"
    When I select "Important Step"
    And I click delete step
    And I cancel the dialog
    Then "Important Step" should still be in the pipeline

  # === REORDER STEPS ===

  @AC-TRN-08
  Scenario: Reorder steps via drag and drop
    Given the pipeline has steps A(0), B(1), C(2)
    When I drag step C to position 0
    Then the steps should be ordered C(0), A(1), B(2)

  Scenario: Move step down
    Given the pipeline has steps A(0), B(1), C(2)
    When I move step A to position 2
    Then the steps should be ordered B(0), C(1), A(2)

  Scenario: Move step to same position has no effect
    Given the pipeline has steps A(0), B(1)
    When I move step A to position 0
    Then the steps should still be A(0), B(1)

  Scenario: Step order affects output schema
    Given the pipeline has a filter then aggregate
    When I reorder aggregate before filter
    Then the preview should reflect the new order

  # === STEP CONFIGURATION FORMS ===

  @AC-TRN-13
  Scenario: Filter step shows appropriate configuration
    When I add a step of type "filter"
    Then I should see a field selector dropdown
    And I should see an operator selector
    And I should see a value input
    And available operators should include eq, neq, gt, lt, gte, lte, contains, in

  @AC-TRN-13
  Scenario: Map step shows field mapping interface
    When I add a step of type "map"
    Then I should see a source field selector
    And I should see a target field input
    And I should see an optional expression editor
    And I should be able to add multiple mappings

  @AC-TRN-13
  Scenario: Aggregate step shows grouping and metrics
    When I add a step of type "aggregate"
    Then I should see a group by field selector
    And I should see a metrics configuration section
    And metrics should support count, sum, avg, min, max

  Scenario: Sort step shows field and direction
    When I add a step of type "sort"
    Then I should see a field selector
    And I should see direction options ascending/descending
    And I should be able to add multiple sort fields

  Scenario: Deduplicate step shows key field selection
    When I add a step of type "deduplicate"
    Then I should see a multi-select for key fields
    And I should see strategy options for which duplicate to keep

  # === VALIDATION ===

  @validation
  Scenario: Filter step requires all fields
    When I add a filter step
    And I leave the field empty
    And I click save step
    Then I should see a validation error

  @validation
  Scenario: Map step requires at least one mapping
    When I add a map step
    And I don't add any mappings
    And I click save step
    Then I should see a validation error

  @validation
  Scenario: Join step requires target source
    When I add a join step
    And I don't select a target source
    And I click save step
    Then I should see a validation error

  # === SCHEMA PROPAGATION ===

  @schema
  Scenario: Filter step preserves input schema
    Given the pipeline has a filter step
    When I view the step output schema
    Then it should match the input schema
    And only the row count should differ

  @schema
  Scenario: Map step shows renamed fields
    Given the pipeline has a map step renaming fields
    When I view the step output schema
    Then it should show the new field names

  @schema
  Scenario: Aggregate step shows grouped fields and metrics
    Given the pipeline has an aggregate step
    When I view the step output schema
    Then it should show group by fields
    And it should show metric aliases
