@auth
Feature: User Authentication - Logout

  As an authenticated user
  I want to securely log out of the system
  So that my session is terminated and my account is protected

  Background:
    Given I am logged in as "admin@example.com"

  # === SMOKE TESTS ===

  @smoke @AC-USR-08
  Scenario: User can logout successfully
    When I click the user menu
    And I click logout
    Then I should be redirected to the login page
    And I should not see the user menu

  # === SESSION TERMINATION ===

  @session @AC-USR-08
  Scenario: JWT token is removed after logout
    When I click the user menu
    And I click logout
    And I navigate directly to the dashboard URL
    Then I should be redirected to the login page

  @session
  Scenario: Cannot access protected endpoints after logout
    When I click the user menu
    And I click logout
    Then subsequent API requests should return 401

  @session
  Scenario: Logout clears all session data
    When I click the user menu
    And I click logout
    And I navigate to the login page
    Then the email field should be empty
    And the password field should be empty

  # === MULTI-TAB BEHAVIOR ===

  @multitab
  Scenario: Logout affects all open tabs
    Given I have another tab open with the dashboard
    When I click the user menu in the first tab
    And I click logout
    And I switch to the second tab
    And I refresh the page
    Then I should be redirected to the login page

  # === EDGE CASES ===

  @edge
  Scenario: Double logout does not cause errors
    When I click the user menu
    And I click logout
    And I navigate to the login page
    And I try to access the logout endpoint directly
    Then I should remain on the login page
    And I should not see any errors

  @edge
  Scenario: Can login again after logout
    When I click the user menu
    And I click logout
    And I am on the login page
    And I enter email "admin@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see the user menu
