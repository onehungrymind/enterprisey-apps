@ingress
Feature: Sync Data Source

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  Scenario: Sync a connected source
    Given there is a source named "Production DB"
    When I select "Production DB"
    And I click "Sync Now"
    Then the status should change to "syncing"
    And within 30 seconds the status should be "connected"
    And the "Last Synced" timestamp should be updated

  Scenario: Cannot sync a disconnected source
    Given there is a source named "Offline DB"
    When I select "Offline DB"
    Then the "Sync Now" button should be disabled
