@ingress @connection
Feature: Data Source Connection Testing

  As a data engineer
  I want to test connections to data sources
  So that I can verify connectivity before syncing

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  # === SUCCESSFUL CONNECTION ===

  @smoke @AC-ING-05
  Scenario: Test connection succeeds for valid database
    Given there is a database source "Valid DB" with correct credentials
    When I select "Valid DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And I should see a loading indicator
    And within 10 seconds the status should be "connected"
    And I should see a success message

  Scenario: Test connection succeeds for valid REST API
    Given there is a REST API source "Valid API" with correct endpoint
    When I select "Valid API"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "connected"

  Scenario: Test connection succeeds for valid CSV file
    Given there is a CSV source "Valid CSV" with accessible file path
    When I select "Valid CSV"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "connected"

  # === FAILED CONNECTION ===

  @AC-ING-06
  Scenario: Test connection fails for invalid database credentials
    Given there is a database source "Invalid DB" with wrong password
    When I select "Invalid DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"
    And I should see an error message about authentication

  Scenario: Test connection fails for unreachable host
    Given there is a database source "Unreachable DB" with invalid host
    When I select "Unreachable DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"
    And I should see an error message about connection timeout

  Scenario: Test connection fails for invalid port
    Given there is a database source "Wrong Port DB" with invalid port
    When I select "Wrong Port DB"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"

  Scenario: Test connection fails for non-existent API endpoint
    Given there is a REST API source "404 API" with non-existent endpoint
    When I select "404 API"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"
    And I should see an error message about endpoint not found

  Scenario: Test connection fails for missing CSV file
    Given there is a CSV source "Missing File" with non-existent path
    When I select "Missing File"
    And I click "Test Connection"
    Then the status should change to "testing"
    And within 10 seconds the status should be "error"
    And I should see an error message about file not found

  # === POLLING BEHAVIOR ===

  @AC-ING-07
  Scenario: UI polls for status during test
    Given there is a source "Polling Test" in disconnected status
    When I click "Test Connection"
    Then the status should change to "testing"
    And the UI should poll for updates every 2 seconds
    And polling should stop when status changes from "testing"

  Scenario: Polling continues until terminal status
    Given a connection test is in progress
    When the status is "testing"
    Then the UI should continue polling
    When the status changes to "connected"
    Then polling should stop

  # === ERROR LOG ===

  @AC-ING-11
  Scenario: Failed connection adds error to error log
    Given there is a source "Error Logger" that will fail connection
    When I click "Test Connection"
    And the test fails
    Then a new entry should appear in the error log
    And the error log should show the failure reason
    And the error log should show the timestamp

  Scenario: Error log maintains history
    Given there is a source with previous connection errors
    When the source has another connection failure
    Then the error log should contain all previous errors
    And the newest error should be at the top

  Scenario: Error log is append-only
    Given there is a source with errors in the log
    When I view the error log
    Then I should not see a delete option for individual errors

  # === UI STATES ===

  @ui
  Scenario: Test Connection button is disabled during testing
    Given there is a source with status "testing"
    Then the "Test Connection" button should be disabled

  Scenario: Test Connection button shows loading spinner
    When I click "Test Connection"
    Then the button should show a loading spinner
    And the button text should change to "Testing..."

  Scenario: Can retry failed connection test
    Given there is a source with status "error"
    When I click "Test Connection"
    Then the test should start again
    And the status should change to "testing"

  # === EDGE CASES ===

  @edge
  Scenario: Connection test timeout
    Given there is a source that takes too long to respond
    When I click "Test Connection"
    And the test times out after 30 seconds
    Then the status should change to "error"
    And I should see a timeout error message

  Scenario: Network error during connection test
    Given there is a source "Network Issue"
    And the network is unavailable
    When I click "Test Connection"
    Then the status should change to "error"
    And I should see a network error message

  Scenario: Multiple rapid test clicks are debounced
    Given there is a source "Click Test"
    When I rapidly click "Test Connection" 5 times
    Then only one test should be initiated
