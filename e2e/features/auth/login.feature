@auth
Feature: User Authentication - Login

  As a user of the enterprise application
  I want to securely log into the system
  So that I can access my authorized features

  Background:
    Given I am on the login page

  # === SMOKE TESTS ===

  @smoke @AC-USR-01
  Scenario: Successful login with valid admin credentials
    When I enter email "admin@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see the user menu
    And I should see "admin" in the user menu

  @smoke
  Scenario: Login page displays correctly
    Then I should see the email input field
    And I should see the password input field
    And I should see the sign in button
    And the sign in button should be enabled

  # === NEGATIVE TESTS ===

  @negative @AC-USR-02
  Scenario: Failed login with invalid email
    When I enter email "nonexistent@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  @negative @AC-USR-02
  Scenario: Failed login with invalid password
    When I enter email "admin@example.com"
    And I enter password "wrongpassword"
    And I click the sign in button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  @negative
  Scenario: Failed login with empty email
    When I enter password "password123"
    And I click the sign in button
    Then I should see validation errors
    And I should remain on the login page

  @negative
  Scenario: Failed login with empty password
    When I enter email "admin@example.com"
    And I click the sign in button
    Then I should see validation errors
    And I should remain on the login page

  @negative
  Scenario: Failed login with both fields empty
    When I click the sign in button
    Then I should see validation errors
    And I should remain on the login page

  @negative
  Scenario: Failed login with malformed email
    When I enter email "not-an-email"
    And I enter password "password123"
    And I click the sign in button
    Then I should see validation errors
    And I should remain on the login page

  @negative
  Scenario: Failed login with SQL injection attempt
    When I enter email "admin@example.com'; DROP TABLE users;--"
    And I enter password "password123"
    And I click the sign in button
    Then I should see an error message
    And I should remain on the login page

  @negative
  Scenario: Failed login with XSS attempt
    When I enter email "<script>alert('xss')</script>@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should see an error message
    And I should remain on the login page

  # === ROLE-BASED LOGIN ===

  @roles
  Scenario: Login as manager user
    When I enter email "manager@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see "manager" in the user menu

  @roles
  Scenario: Login as regular user
    When I enter email "user@example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see "user" in the user menu

  # === EDGE CASES ===

  @edge
  Scenario: Login with email containing uppercase letters
    When I enter email "ADMIN@EXAMPLE.COM"
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard

  @edge
  Scenario: Login with leading/trailing whitespace in email
    When I enter email "  admin@example.com  "
    And I enter password "password123"
    And I click the sign in button
    Then I should be redirected to the dashboard

  @edge
  Scenario: Login with very long email
    When I enter email "verylongemailaddressthatexceedsreasonablelength@verylongdomainname.example.com"
    And I enter password "password123"
    And I click the sign in button
    Then I should see an error message

  @edge
  Scenario: Login after page refresh
    When I enter email "admin@example.com"
    And I refresh the page
    Then I should be on the login page
    And the email field should be empty

  @edge
  Scenario: Login form preserves email on failed attempt
    When I enter email "admin@example.com"
    And I enter password "wrongpassword"
    And I click the sign in button
    Then I should see an error message
    And the email field should contain "admin@example.com"
    And the password field should be empty

  # === ACCESSIBILITY ===

  @a11y
  Scenario: Login form is keyboard accessible
    When I focus on the email field using keyboard
    And I type "admin@example.com" using keyboard
    And I press Tab
    And I type "password123" using keyboard
    And I press Enter
    Then I should be redirected to the dashboard

  # === SESSION MANAGEMENT ===

  @session
  Scenario: Session persists after login
    When I enter email "admin@example.com"
    And I enter password "password123"
    And I click the sign in button
    And I am redirected to the dashboard
    And I refresh the page
    Then I should still be on the dashboard
    And I should see the user menu

  @session
  Scenario: Cannot access protected pages without login
    Given I am not logged in
    When I navigate directly to the dashboard URL
    Then I should be redirected to the login page
