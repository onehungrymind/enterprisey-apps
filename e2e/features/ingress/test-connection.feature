@ingress
Feature: Test Data Source Connection

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  Scenario: Test connection succeeds
    Given there is a source named "Test DB"
    When I select "Test DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "connected"

  Scenario: Test connection fails
    Given there is a source named "Bad DB"
    When I select "Bad DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"
