@users @audit
Feature: User Audit Logging

  As an admin
  I want to track user-related events
  So that I can audit access and changes

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the users page

  # === LOGIN EVENTS ===

  Scenario: Successful login is logged
    Given a user logs in successfully
    Then the login event should be recorded
    And the event should include userId and email
    And the event should include timestamp

  Scenario: Failed login is logged
    Given a user fails to login
    Then the login failure event should be recorded
    And the event should include email and reason

  # === USER MANAGEMENT EVENTS ===

  Scenario: User creation is logged
    When I create a new user "Audit User"
    Then the user created event should be recorded
    And the event should include userId, email, and role

  Scenario: User update is logged
    When I update a user's role
    Then the user updated event should be recorded
    And the event should include what was changed

  Scenario: User deletion is logged
    When I delete a user
    Then the user deleted event should be recorded
    And the event should include userId

  # === TOKEN EVENTS ===

  @AC-USR-03
  Scenario: Token validation is logged
    Given a user makes an API request with valid token
    Then the token validated event should be recorded

  @AC-USR-04
  Scenario: Token rejection is logged
    Given a user makes an API request with invalid token
    Then the token rejected event should be recorded
    And the event should include the reason

  # === VIEW AUDIT LOG ===

  Scenario: Admin can view audit log
    Given there are audit events
    When I navigate to the audit log
    Then I should see a list of events
    And each event should show timestamp and description

  Scenario: Filter audit log by event type
    Given there are various audit events
    When I filter by event type "UserCreated"
    Then I should only see user creation events

  Scenario: Filter audit log by date range
    Given there are audit events from different dates
    When I filter by date range
    Then I should only see events within that range

  Scenario: Search audit log
    Given there are audit events for various users
    When I search for a specific user email
    Then I should see events related to that user

  # === AUDIT LOG DETAILS ===

  Scenario: View event details
    Given there is an audit event
    When I click on the event
    Then I should see the full event details
    And I should see the user who performed the action

  Scenario: Audit log shows IP address
    Given there are audit events
    Then events should include IP address information

  Scenario: Audit log shows user agent
    Given there are audit events
    Then events should include user agent information

  # === EXPORT AUDIT LOG ===

  Scenario: Export audit log to CSV
    Given there are audit events
    When I click "Export to CSV"
    Then a CSV file should be downloaded
    And it should contain the audit events

  Scenario: Export audit log with filters
    Given I have applied filters to the audit log
    When I export the log
    Then only filtered events should be exported

  # === SECURITY ===

  Scenario: Only admins can view audit log
    Given I am logged in as "user@example.com"
    When I try to access the audit log
    Then I should see access denied

  Scenario: Audit log is immutable
    Given there are audit events
    Then I should not be able to edit events
    And I should not be able to delete events
