@portal @health
Feature: System Health Monitoring

  As an admin
  I want to monitor system health
  So that I can identify and respond to issues quickly

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the portal page

  # === HEALTH GRID DISPLAY ===

  @smoke
  Scenario: View health grid
    Then I should see the health grid
    And I should see status for all 6 services

  Scenario: Health grid shows API services
    Then I should see health status for "Ingress API"
    And I should see health status for "Transformation API"
    And I should see health status for "Reporting API"
    And I should see health status for "Export API"
    And I should see health status for "Users API"
    And I should see health status for "Features API"

  Scenario: Healthy services show green status
    Given all services are healthy
    Then all service cards should be green
    And each card should show "Healthy" or checkmark

  Scenario: Unhealthy services show red status
    Given a service is unhealthy
    Then that service card should be red
    And it should show "Unhealthy" or error indicator

  Scenario: Degraded services show yellow status
    Given a service is responding slowly
    Then that service card should be yellow
    And it should show "Degraded" or warning indicator

  # === DATABASE HEALTH ===

  Scenario: Health check includes database status
    Then I should see database connectivity status
    And each API should show its database health

  Scenario: Database connection failure shown
    Given a database connection is failing
    Then the affected service should show database error
    And details should explain the issue

  # === REFRESH HEALTH ===

  Scenario: Manual health refresh
    When I click "Refresh"
    Then all health checks should run
    And I should see a loading indicator
    And then updated status for all services

  Scenario: Last checked timestamp updates
    When I click "Refresh"
    And the health check completes
    Then the "Last checked" timestamp should update

  Scenario: Refresh shows individual service loading
    When I refresh health
    Then each service card should show loading state
    And they should update as responses arrive

  # === AUTO REFRESH ===

  Scenario: Health auto-refreshes periodically
    Given I have been on the portal for 60 seconds
    Then health should have refreshed automatically

  Scenario: Disable auto-refresh
    When I disable auto-refresh
    Then health should not refresh automatically

  Scenario: Change auto-refresh interval
    When I change refresh interval to 30 seconds
    Then health should refresh every 30 seconds

  # === ERROR DETAILS ===

  Scenario: Click on unhealthy service shows details
    Given a service is unhealthy
    When I click on the service card
    Then I should see error details
    And I should see when the issue started

  Scenario: Error details show response time
    Given a service is responding
    When I view service details
    Then I should see the response time

  Scenario: Error details show error message
    Given a service is returning errors
    When I view service details
    Then I should see the error message

  # === HEALTH HISTORY ===

  Scenario: View health history
    When I click "History"
    Then I should see past health check results
    And I should see when issues occurred

  Scenario: Health history shows uptime percentage
    Given there is health history
    Then I should see uptime percentage for each service

  Scenario: Health history shows incident timeline
    Given there have been service incidents
    Then I should see an incident timeline

  # === NOTIFICATIONS ===

  Scenario: Alert when service becomes unhealthy
    Given I am on the portal
    When a service becomes unhealthy
    Then I should see an alert notification

  Scenario: Alert clears when service recovers
    Given there is an alert for unhealthy service
    When the service recovers
    Then the alert should clear

  # === SERVICE CARDS ===

  @ui
  Scenario: Service cards show service name
    Then each service card should display the service name

  @ui
  Scenario: Service cards show status icon
    Then each service card should have a status icon
    And icons should reflect current health

  @ui
  Scenario: Service cards are clickable
    When I hover over a service card
    Then it should show clickable state

  @ui
  Scenario: Responsive grid layout
    Given I am on a mobile device
    Then service cards should stack vertically

  # === LOADING STATES ===

  @ui
  Scenario: Initial loading state
    When the page is loading
    Then I should see skeleton loading for health grid

  @ui
  Scenario: Loading after refresh
    When I refresh health
    Then I should see loading indicators
    But existing data should remain visible

  # === ERROR HANDLING ===

  @error
  Scenario: Handle network error during health check
    Given the network is unavailable
    When I try to refresh health
    Then I should see a connection error message
    And I should see a retry button

  @error
  Scenario: Handle partial health check failure
    Given some health checks fail
    Then failed checks should show error state
    And successful checks should show their status

  # === ADMIN ONLY ===

  @security
  Scenario: Only authenticated users can view health
    Given I am not logged in
    When I try to access the portal
    Then I should be redirected to login
