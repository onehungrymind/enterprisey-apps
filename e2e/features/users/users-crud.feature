@users @crud
Feature: User Management

  As an admin
  I want to manage users
  So that I can control access to the system

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the users page

  # === SMOKE TESTS ===

  @smoke
  Scenario: View users list
    Then I should see the users list
    And each user should show name
    And each user should show email
    And each user should show role
    And each user should show company

  @smoke
  Scenario: Users list shows role badges
    Given there are users with different roles
    Then each user should display a role badge
    And admin users should have admin badge
    And regular users should have user badge

  # === CREATE USER ===

  Scenario: Create a new user with all fields
    When I click "Invite User"
    And I fill in firstName "John"
    And I fill in lastName "Doe"
    And I fill in email "john.doe@example.com"
    And I fill in password "SecurePass123!"
    And I select role "user"
    And I select company "Acme Corp"
    And I click send invite
    Then I should see "John Doe" in the users list
    And "John Doe" should have email "john.doe@example.com"

  Scenario: Create admin user
    When I click "Invite User"
    And I fill in firstName "Admin"
    And I fill in lastName "User"
    And I fill in email "newadmin@example.com"
    And I fill in password "AdminPass123!"
    And I select role "admin"
    And I select company "Admin Company"
    And I click send invite
    Then I should see "Admin User" in the users list
    And "Admin User" should have role "admin"

  Scenario: Create mentor user
    When I click "Invite User"
    And I fill in firstName "Mentor"
    And I fill in lastName "User"
    And I fill in email "mentor@example.com"
    And I fill in password "MentorPass123!"
    And I select role "mentor"
    And I click send invite
    Then "Mentor User" should have role "mentor"

  Scenario: Create apprentice user
    When I click "Invite User"
    And I fill in firstName "Apprentice"
    And I fill in lastName "User"
    And I fill in email "apprentice@example.com"
    And I fill in password "ApprenticePass123!"
    And I select role "apprentice"
    And I click send invite
    Then "Apprentice User" should have role "apprentice"

  Scenario: Cancel user creation
    When I click "Invite User"
    And I fill in firstName "Cancelled"
    And I fill in lastName "User"
    And I click cancel
    Then I should not see "Cancelled User" in the users list

  # === UPDATE USER ===

  Scenario: Update user name
    Given there is a user "Jane Smith"
    When I select "Jane Smith"
    And I click edit
    And I change firstName to "Janet"
    And I click save
    Then I should see "Janet Smith" in the users list

  @AC-USR-05
  Scenario: Update user role
    Given there is a user "Jane Smith" with role "user"
    When I select "Jane Smith"
    And I click edit
    And I change role to "mentor"
    And I click save
    Then "Jane Smith" should have role "mentor"

  Scenario: Update user email
    Given there is a user with email "old@example.com"
    When I select the user
    And I click edit
    And I change email to "new@example.com"
    And I click save
    Then the user should have email "new@example.com"

  Scenario: Update user company
    Given there is a user in "Old Company"
    And there is a company "New Company"
    When I select the user
    And I click edit
    And I change company to "New Company"
    And I click save
    Then the user should be in "New Company"

  Scenario: Update user password
    Given there is a user "Password User"
    When I select "Password User"
    And I click edit
    And I fill in new password "NewSecurePass123!"
    And I click save
    Then the password should be updated
    And the user should be able to login with the new password

  Scenario: Cancel user update
    Given there is a user "Unchanged User"
    When I select "Unchanged User"
    And I click edit
    And I change firstName to "Changed"
    And I click cancel
    Then I should still see "Unchanged User" in the users list

  # === DELETE USER ===

  @AC-USR-05
  Scenario: Delete a user
    Given there is a user named "Delete User"
    When I select "Delete User"
    And I click delete
    And I confirm the deletion
    Then I should not see "Delete User" in the users list

  Scenario: Cancel user deletion
    Given there is a user named "Keep User"
    When I select "Keep User"
    And I click delete
    And I cancel the dialog
    Then I should see "Keep User" in the users list

  Scenario: Cannot delete own account
    Given I am viewing my own user profile
    Then the delete button should be disabled or I should see a warning

  Scenario: Cannot delete last admin
    Given there is only one admin user
    When I try to delete the admin user
    Then I should see an error about last admin

  # === VALIDATION ===

  @validation
  Scenario: First name is required
    When I click "Invite User"
    And I leave firstName empty
    And I fill in lastName "Doe"
    And I fill in email "test@example.com"
    And I click send invite
    Then I should see a validation error for firstName

  @validation
  Scenario: Last name is required
    When I click "Invite User"
    And I fill in firstName "John"
    And I leave lastName empty
    And I fill in email "test@example.com"
    And I click send invite
    Then I should see a validation error for lastName

  @validation
  Scenario: Email is required
    When I click "Invite User"
    And I fill in firstName "John"
    And I fill in lastName "Doe"
    And I leave email empty
    And I click send invite
    Then I should see a validation error for email

  @validation
  Scenario: Email must be valid format
    When I click "Invite User"
    And I fill in email "invalid-email"
    And I click send invite
    Then I should see a validation error for email format

  @validation @INV-USR-01
  Scenario: Email must be unique
    Given there is a user with email "existing@example.com"
    When I try to create a user with email "existing@example.com"
    And I click send invite
    Then I should see an error about duplicate email

  @validation @INV-USR-03
  Scenario: Role must be valid
    When I create a user
    Then role options should only be admin, mentor, apprentice, user

  @validation @INV-USR-05
  Scenario: Company must exist
    When I try to create a user with invalid company
    Then I should see a validation error for company

  # === PASSWORD SECURITY ===

  @security @INV-USR-02
  Scenario: Password is hashed before storage
    When I create a user with password "plaintext123"
    Then the password in the database should be a bcrypt hash
    And the hash should validate against the original password

  @security
  Scenario: Password minimum length
    When I try to create a user with password "short"
    Then I should see a validation error for password length

  @security
  Scenario: Password requires complexity
    When I try to create a user with password "simplepassword"
    Then I should see a validation error for password complexity

  # === SEARCH AND FILTER ===

  @search
  Scenario: Search users by name
    Given there are users "John Doe" and "Jane Doe"
    When I search for "John"
    Then I should see "John Doe"
    And I should not see "Jane Doe"

  @search
  Scenario: Search users by email
    Given there are users with emails "john@example.com" and "jane@example.com"
    When I search for "john@"
    Then I should see the user with email "john@example.com"

  @filtering
  Scenario: Filter users by role
    Given there are users with different roles
    When I filter by role "admin"
    Then I should only see admin users

  @filtering
  Scenario: Filter users by company
    Given there are users from different companies
    When I filter by company "Acme Corp"
    Then I should only see users from "Acme Corp"

  Scenario: Clear search shows all users
    Given I have searched for "John"
    When I clear the search
    Then I should see all users

  # === PAGINATION ===

  Scenario: Users list pagination
    Given there are more than 20 users
    When I view the users list
    Then I should see pagination controls
    And I should see the first page of users

  Scenario: Navigate to next page
    Given there are more than 20 users
    When I click next page
    Then I should see the next set of users

  # === EMPTY STATE ===

  @display
  Scenario: Empty state when no users match filter
    When I filter by a role with no users
    Then I should see an empty state message

  # === LOADING STATES ===

  @ui
  Scenario: Loading indicator while fetching users
    When the users list is loading
    Then I should see a loading spinner

  @ui
  Scenario: Form submission shows loading state
    When I submit the create user form
    Then the submit button should show loading state

  # === ERROR HANDLING ===

  @error
  Scenario: Handle network error when loading users
    Given the API is unavailable
    When I try to load users
    Then I should see an error message
    And I should see a retry button

  @error
  Scenario: Handle error when creating user fails
    Given the API returns an error on create
    When I try to create a user
    Then I should see an error notification
