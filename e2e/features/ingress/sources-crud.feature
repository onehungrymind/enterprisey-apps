@ingress @crud
Feature: Data Source CRUD Operations

  As a data engineer
  I want to manage data sources
  So that I can connect to external data for processing

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  # === SMOKE TESTS ===

  @smoke @AC-ING-01
  Scenario: View data sources list
    Then I should see the sources list
    And each source should display its name, type, and status

  @smoke
  Scenario: Sources list shows filter chips
    Then I should see filter chips for source types
    And I should see filter chips for connection status

  # === CREATE SOURCE ===

  @AC-ING-02
  Scenario: Create a database source with valid configuration
    When I click "New Data Source"
    And I select source type "database"
    And I fill in name "Production Database"
    And I fill in host "db.example.com"
    And I fill in port "5432"
    And I fill in database "production"
    And I fill in username "dbuser"
    And I fill in password "dbpass"
    And I click save
    Then I should see "Production Database" in the sources list
    And the source status should be "disconnected"
    And the source type should be "database"

  Scenario: Create a REST API source
    When I click "New Data Source"
    And I select source type "rest_api"
    And I fill in name "External API"
    And I fill in apiUrl "https://api.example.com/v1/data"
    And I fill in authType "bearer"
    And I fill in authToken "my-api-token"
    And I click save
    Then I should see "External API" in the sources list
    And the source type should be "rest_api"

  Scenario: Create a CSV file source
    When I click "New Data Source"
    And I select source type "csv_file"
    And I fill in name "Sales CSV"
    And I fill in filePath "/data/sales/2024.csv"
    And I fill in delimiter ","
    And I fill in encoding "UTF-8"
    And I click save
    Then I should see "Sales CSV" in the sources list
    And the source type should be "csv_file"

  Scenario: Create a webhook source
    When I click "New Data Source"
    And I select source type "webhook"
    And I fill in name "Event Webhook"
    And I click save
    Then I should see "Event Webhook" in the sources list
    And I should see a generated callback URL
    And I should see a secret token

  # === UPDATE SOURCE ===

  @AC-ING-03
  Scenario: Update source name
    Given there is a source named "Old Source Name"
    When I select "Old Source Name"
    And I click configure
    And I change the name to "New Source Name"
    And I click save
    Then I should see "New Source Name" in the sources list
    And I should not see "Old Source Name" in the sources list

  Scenario: Update source connection configuration
    Given there is a database source named "Test DB"
    When I select "Test DB"
    And I click configure
    And I change the host to "newhost.example.com"
    And I change the port to "5433"
    And I click save
    Then the source should have the updated configuration
    And the source status should be "disconnected"

  Scenario: Update source sync frequency
    Given there is a source named "Scheduled Source"
    When I select "Scheduled Source"
    And I click configure
    And I change the sync frequency to "hourly"
    And I click save
    Then the source should have sync frequency "hourly"

  # === DELETE SOURCE ===

  @AC-ING-04
  Scenario: Delete a source
    Given there is a source named "Source To Delete"
    When I select "Source To Delete"
    And I click delete
    And I confirm the deletion
    Then I should not see "Source To Delete" in the sources list

  Scenario: Cancel delete confirmation
    Given there is a source named "Keep This Source"
    When I select "Keep This Source"
    And I click delete
    And I cancel the dialog
    Then I should see "Keep This Source" in the sources list

  Scenario: Delete source removes associated schemas
    Given there is a source "Source With Schema" that has been synced
    When I select "Source With Schema"
    And I click delete
    And I confirm the deletion
    Then I should not see "Source With Schema" in the sources list
    And the associated schema should be removed

  # === VALIDATION ===

  @validation
  Scenario: Cannot create source without name
    When I click "New Data Source"
    And I select source type "database"
    And I fill in host "localhost"
    And I click save
    Then I should see a validation error for name
    And the source should not be created

  @validation
  Scenario: Cannot create database source without host
    When I click "New Data Source"
    And I select source type "database"
    And I fill in name "Test Source"
    And I click save
    Then I should see a validation error for host
    And the source should not be created

  @validation
  Scenario: Port must be a valid number
    When I click "New Data Source"
    And I select source type "database"
    And I fill in name "Test Source"
    And I fill in host "localhost"
    And I fill in port "not-a-number"
    And I click save
    Then I should see a validation error for port

  @validation
  Scenario: Cannot create duplicate source names
    Given there is a source named "Existing Source"
    When I click "New Data Source"
    And I select source type "database"
    And I fill in name "Existing Source"
    And I fill in host "localhost"
    And I click save
    Then I should see an error about duplicate name

  # === FILTERING AND SEARCH ===

  @filtering
  Scenario: Filter sources by type
    Given there are sources of type "database" and "rest_api"
    When I click the "database" filter chip
    Then I should only see sources of type "database"

  @filtering
  Scenario: Filter sources by status
    Given there are sources with status "connected" and "disconnected"
    When I click the "connected" filter chip
    Then I should only see sources with status "connected"

  @filtering
  Scenario: Clear filters shows all sources
    Given I have applied type filter "database"
    When I clear all filters
    Then I should see all sources

  @search
  Scenario: Search sources by name
    Given there are sources named "Production DB" and "Staging API"
    When I search for "Production"
    Then I should see "Production DB"
    And I should not see "Staging API"

  # === LIST DISPLAY ===

  @display
  Scenario: Source list shows last sync time
    Given there is a synced source "Synced Source"
    Then I should see the last sync time for "Synced Source"

  @display
  Scenario: Source list shows error indicator
    Given there is a source with status "error"
    Then I should see an error indicator on the source

  @display
  Scenario: Empty state when no sources exist
    Given there are no data sources
    Then I should see an empty state message
    And I should see a "Create your first source" button
