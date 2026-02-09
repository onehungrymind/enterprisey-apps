@reporting @queries
Feature: Report Query Management

  As a data analyst
  I want to manage report queries
  So that I can define data retrieval for widgets and exports

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the reporting page

  # === VIEW QUERIES ===

  Scenario: View queries list
    Given there are existing queries
    When I navigate to the queries section
    Then I should see the queries list
    And each query should show name and pipeline reference

  Scenario: View query details
    Given there is a query named "Sales Query"
    When I click on "Sales Query"
    Then I should see the query configuration
    And I should see aggregation settings
    And I should see filter settings

  # === CREATE QUERY ===

  @AC-RPT-12
  Scenario: Create a new query with aggregation
    When I click "New Query"
    And I fill in name "Monthly Sales"
    And I select pipeline "Sales Pipeline"
    And I add group by field "month"
    And I add metric field "revenue" with function "sum" as "total_revenue"
    And I click save query
    Then I should see "Monthly Sales" in the queries list

  Scenario: Create query with filters
    When I click "New Query"
    And I fill in name "Active Customers"
    And I select pipeline "Customer Pipeline"
    And I add filter "status" equals "active"
    And I click save query
    Then I should see "Active Customers" in the queries list

  Scenario: Create query with cache duration
    When I click "New Query"
    And I fill in name "Cached Query"
    And I select pipeline "Data Pipeline"
    And I set cache duration to 3600 seconds
    And I click save query
    Then the query should have cache duration configured

  Scenario: Create query with multiple metrics
    When I click "New Query"
    And I fill in name "Multiple Metrics"
    And I add metric "count" with function "count" as "record_count"
    And I add metric "revenue" with function "sum" as "total_revenue"
    And I add metric "revenue" with function "avg" as "avg_revenue"
    And I click save query
    Then the query should have 3 metrics configured

  Scenario: Create query with multiple group by fields
    When I click "New Query"
    And I fill in name "Multi Group"
    And I add group by field "region"
    And I add group by field "product"
    And I click save query
    Then the query should group by region and product

  # === UPDATE QUERY ===

  @AC-RPT-12
  Scenario: Update query name
    Given there is a query named "Old Query Name"
    When I edit the query
    And I change the name to "New Query Name"
    And I click save query
    Then I should see "New Query Name" in the queries list

  Scenario: Update query aggregation
    Given there is a query with sum aggregation
    When I edit the query
    And I change aggregation function to "avg"
    And I click save query
    Then the query should use avg aggregation

  Scenario: Update query filters
    Given there is a query with filter "status = active"
    When I edit the query
    And I change the filter to "status = inactive"
    And I click save query
    Then the query should filter by inactive status

  Scenario: Remove query filter
    Given there is a query with filters
    When I edit the query
    And I remove all filters
    And I click save query
    Then the query should have no filters

  # === DELETE QUERY ===

  @AC-RPT-12
  Scenario: Delete a query
    Given there is a query named "Delete Query"
    When I delete the query
    And I confirm the deletion
    Then I should not see "Delete Query" in the queries list

  Scenario: Cannot delete query used by widgets
    Given there is a query used by a widget
    When I try to delete the query
    Then I should see a warning about dependent widgets
    And the query should not be deleted

  Scenario: Force delete query with dependents
    Given there is a query used by a widget
    When I force delete the query
    And I confirm the deletion
    Then the query should be deleted
    And dependent widgets should show an error

  # === EXECUTE QUERY ===

  @AC-RPT-09
  Scenario: Execute a query successfully
    Given there is a query named "Test Query"
    When I execute "Test Query"
    Then I should see the query results
    And results should show column headers
    And results should show data rows
    And I should see totalRows count
    And I should see executedAt timestamp

  Scenario: Execute query respects aggregation
    Given there is a query with sum aggregation on "revenue" grouped by "region"
    When I execute the query
    Then the results should show one row per region
    And each row should have the summed revenue

  Scenario: Execute query respects filters
    Given there is a query with filter "status = active"
    When I execute the query
    Then the results should only include active records

  Scenario: Execute query with cache hit
    Given there is a cached query
    And the cache is not expired
    When I execute the query
    Then the results should come from cache
    And the response should include cachedAt timestamp

  Scenario: Execute query with cache miss
    Given there is a query with expired cache
    When I execute the query
    Then the query should be re-executed
    And the cache should be updated

  # === QUERY PREVIEW ===

  Scenario: Preview query results
    Given there is a query configured
    When I click "Preview"
    Then I should see a sample of the results
    And I should see column types

  Scenario: Preview shows limited rows
    Given there is a query that returns 10000 rows
    When I preview the query
    Then I should see at most 100 rows
    And I should see a message about more data

  # === VALIDATION ===

  @validation
  Scenario: Query name is required
    When I click "New Query"
    And I leave the name empty
    And I click save query
    Then I should see a validation error for name

  @validation
  Scenario: Pipeline selection is required
    When I click "New Query"
    And I fill in name "No Pipeline Query"
    And I do not select a pipeline
    And I click save query
    Then I should see a validation error for pipeline

  @validation
  Scenario: Aggregation metric requires field
    When I configure an aggregation metric
    And I select function "sum"
    And I do not select a field
    Then I should see a validation error

  @validation
  Scenario: Aggregation metric requires alias
    When I configure an aggregation metric
    And I select field "revenue"
    And I select function "sum"
    And I leave alias empty
    Then I should see a validation error for alias

  # === FILTER OPERATORS ===

  Scenario: Filter with equals operator
    When I add a filter with operator "eq"
    Then the filter should match exact values

  Scenario: Filter with not equals operator
    When I add a filter with operator "neq"
    Then the filter should exclude matching values

  Scenario: Filter with greater than operator
    When I add a filter with operator "gt"
    Then the filter should match values greater than specified

  Scenario: Filter with less than operator
    When I add a filter with operator "lt"
    Then the filter should match values less than specified

  Scenario: Filter with contains operator
    When I add a filter with operator "contains"
    Then the filter should match partial text matches

  Scenario: Filter with in operator
    When I add a filter with operator "in"
    And I specify multiple values
    Then the filter should match any of the values

  # === AGGREGATION FUNCTIONS ===

  Scenario: Count aggregation
    When I configure a count aggregation
    Then the results should show record counts

  Scenario: Sum aggregation
    When I configure a sum aggregation on numeric field
    Then the results should show summed values

  Scenario: Average aggregation
    When I configure an avg aggregation on numeric field
    Then the results should show average values

  Scenario: Min aggregation
    When I configure a min aggregation
    Then the results should show minimum values

  Scenario: Max aggregation
    When I configure a max aggregation
    Then the results should show maximum values

  # === ERROR HANDLING ===

  @error
  Scenario: Query execution error shows message
    Given there is a query with invalid configuration
    When I execute the query
    Then I should see an error message
    And I should see error details

  @error
  Scenario: Query timeout shows appropriate message
    Given there is a long-running query
    When the query times out
    Then I should see a timeout message
    And I should see option to retry
