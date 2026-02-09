@portal @workflows @integration
Feature: Cross-Domain Workflows

  As a user
  I want to perform end-to-end workflows
  So that data flows seamlessly through the system

  Background:
    Given I am logged in as "admin@example.com"

  # === INGRESS TO TRANSFORMATION ===

  @e2e
  Scenario: Create pipeline from source
    Given I am on the ingress page
    And there is a connected source "Sales DB"
    When I click "Create Pipeline" on "Sales DB"
    Then I should be on the transformation page
    And a new pipeline should be pre-configured with "Sales DB" as source

  Scenario: Source schema available in transformation
    Given there is a synced source "Customer Data"
    When I create a pipeline using "Customer Data"
    And I add a step
    Then I should see the source schema fields available

  # === TRANSFORMATION TO REPORTING ===

  @e2e
  Scenario: Create query from pipeline
    Given I am on the transformation page
    And there is a pipeline "ETL Pipeline"
    When I click "Create Query" on "ETL Pipeline"
    Then I should be on the reporting page
    And a new query should be pre-configured with "ETL Pipeline"

  Scenario: Pipeline output available in queries
    Given there is a pipeline with output schema
    When I create a query for that pipeline
    Then I should see the pipeline output fields available

  # === REPORTING TO EXPORT ===

  @e2e
  Scenario: Export query results
    Given I am on the reporting page
    And there is a query "Monthly Revenue"
    When I click "Export" on "Monthly Revenue"
    Then I should be on the export page
    And a new export job should be pre-configured with "Monthly Revenue"

  Scenario: Export from dashboard widget
    Given I am viewing a dashboard with widgets
    When I click "Export" on a widget
    Then an export job should be created for that widget's query

  # === END-TO-END WORKFLOW ===

  @e2e @smoke
  Scenario: Complete data pipeline workflow
    # Ingress: Create and sync source
    Given I am on the ingress page
    When I create a new database source "Production DB"
    And I test the connection successfully
    And I sync the source
    Then the schema should be discovered

    # Transformation: Create and run pipeline
    When I navigate to transformation
    And I create a pipeline "Sales ETL" using "Production DB"
    And I add a filter step for active records
    And I add a map step to rename fields
    And I run the pipeline
    Then the pipeline should complete successfully

    # Reporting: Create dashboard
    When I navigate to reporting
    And I create a query "Sales Summary" from "Sales ETL"
    And I create a dashboard "Sales Dashboard"
    And I add a bar chart widget using "Sales Summary"
    Then the dashboard should display the chart

    # Export: Download data
    When I navigate to export
    And I create an export job for "Sales Summary" as CSV
    And the job completes
    Then I should be able to download the file

  # === SOURCE CHANGES PROPAGATION ===

  Scenario: Schema change affects pipeline
    Given there is a pipeline using a source
    When the source schema changes
    And I sync the source
    Then the pipeline should show a warning about schema changes

  Scenario: Pipeline change affects query
    Given there is a query using a pipeline
    When the pipeline output changes
    Then the query should reflect the new schema

  # === DATA LINEAGE ===

  Scenario: View data lineage
    Given there is a complete workflow
    When I view data lineage
    Then I should see source -> pipeline -> query -> dashboard/export

  Scenario: Navigate lineage to source
    Given I am viewing a dashboard widget
    When I click "View Source"
    Then I should see the data origin

  # === ERROR PROPAGATION ===

  Scenario: Source error affects downstream
    Given there is a connected source
    When the source becomes unavailable
    Then pipelines using that source should show warning
    And queries should show data unavailable

  Scenario: Pipeline error affects reporting
    Given there is a query using a pipeline
    When the pipeline fails
    Then the query should show error
    And widgets using the query should show error

  # === REFRESH CASCADE ===

  Scenario: Sync source refreshes pipeline
    Given there is a source -> pipeline -> query chain
    When I sync the source
    Then the pipeline should refresh
    And the query results should update

  # === CROSS-DOMAIN SEARCH ===

  Scenario: Global search finds sources
    When I search for "customer"
    Then I should see matching sources
    And matching pipelines
    And matching dashboards

  Scenario: Search result navigation
    When I search and find a result
    And I click the result
    Then I should navigate to that item
