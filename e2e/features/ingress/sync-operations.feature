@ingress @sync
Feature: Data Source Sync Operations

  As a data engineer
  I want to sync data sources
  So that I can discover and update schema information

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  # === SUCCESSFUL SYNC ===

  @smoke @AC-ING-08
  Scenario: Sync connected source successfully
    Given there is a connected source "Production DB"
    When I select "Production DB"
    And I click "Sync Now"
    Then the status should change to "syncing"
    And I should see a sync progress indicator
    And within 30 seconds the status should be "connected"
    And the "Last Synced" timestamp should be updated

  Scenario: Sync creates new schema version
    Given there is a connected source "Version Test" with schema version 1
    When I sync the source
    Then a new schema version 2 should be created
    And the schema should have the latest discovered fields

  # === SYNC RESTRICTIONS ===

  @AC-ING-07-invariant
  Scenario: Cannot sync disconnected source
    Given there is a disconnected source "Offline DB"
    When I select "Offline DB"
    Then the "Sync Now" button should be disabled
    And I should see a tooltip explaining sync requires connection

  Scenario: Can sync source with error status
    Given there is a source with status "error"
    When I select the source
    Then the "Sync Now" button should be enabled
    And I should be able to attempt a sync

  Scenario: Cannot sync source that is currently syncing
    Given there is a source with status "syncing"
    Then the "Sync Now" button should be disabled

  # === SCHEMA DISCOVERY ===

  @AC-ING-09
  Scenario: View discovered schema fields
    Given there is a synced source "Schema Source"
    When I select "Schema Source"
    And I click on the schema tab
    Then I should see the discovered fields
    And each field should show name and type
    And each field should show nullable status
    And each field should show sample values

  @AC-ING-10
  Scenario: Schema versioning is incremented on sync
    Given a source has been synced twice
    When I view the source schema
    Then the schema version should be 2
    And I should be able to view previous schema versions

  Scenario: Schema shows field types correctly
    Given there is a synced source with various field types
    When I view the schema
    Then string fields should show type "string"
    And number fields should show type "number"
    And boolean fields should show type "boolean"
    And date fields should show type "date"

  # === SYNC FAILURES ===

  Scenario: Sync failure updates status to error
    Given there is a connected source that will fail to sync
    When I click "Sync Now"
    Then the status should change to "syncing"
    And within 30 seconds the status should be "error"
    And an error should be added to the error log

  Scenario: Sync failure preserves previous schema
    Given there is a source with existing schema
    When a sync fails
    Then the previous schema should still be available
    And the schema version should not increment

  # === SYNC FREQUENCY ===

  Scenario: Manual sync frequency is default
    Given I create a new source
    Then the sync frequency should be "manual"

  Scenario: Configure automatic sync frequency
    Given there is a source with manual sync
    When I change the sync frequency to "hourly"
    And I save the changes
    Then the source should show sync frequency "hourly"

  Scenario: Available sync frequency options
    When I view the sync frequency dropdown
    Then I should see options for "manual"
    And I should see options for "hourly"
    And I should see options for "daily"
    And I should see options for "weekly"

  # === UI STATES ===

  @ui
  Scenario: Sync button shows progress during sync
    When I click "Sync Now"
    Then the button should show a loading spinner
    And the button text should change to "Syncing..."

  Scenario: Last sync time is displayed in relative format
    Given a source was synced 5 minutes ago
    Then I should see "Synced 5 minutes ago"

  Scenario: Last sync time updates after sync
    Given a source shows "Synced 1 hour ago"
    When I sync the source successfully
    Then the sync time should show "Synced just now"

  # === CONCURRENT SYNCS ===

  @edge
  Scenario: Cannot initiate second sync while first is running
    Given a sync is in progress for source "Busy Source"
    When I try to sync "Busy Source" again
    Then the sync button should be disabled
    And I should see the existing sync progress

  Scenario: Multiple sources can sync concurrently
    Given there are connected sources "Source A" and "Source B"
    When I sync "Source A"
    And I sync "Source B" in another tab
    Then both syncs should proceed independently
