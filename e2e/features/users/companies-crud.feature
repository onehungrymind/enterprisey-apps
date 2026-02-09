@users @companies @crud
Feature: Company Management

  As an admin
  I want to manage companies
  So that I can organize users into organizations

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the users page
    And I am on the companies tab

  # === SMOKE TESTS ===

  @smoke
  Scenario: View companies list
    Then I should see the companies list
    And each company should show name
    And each company should show description
    And each company should show user count

  @smoke
  Scenario: Companies tab accessible
    Given I am on the users page
    When I click "Companies"
    Then I should see the companies tab content

  # === CREATE COMPANY ===

  Scenario: Create a new company with all fields
    When I click "Add Company"
    And I fill in name "New Corp"
    And I fill in description "A new corporation"
    And I click save
    Then I should see "New Corp" in the companies list
    And "New Corp" should show description "A new corporation"

  Scenario: Create company with minimum fields
    When I click "Add Company"
    And I fill in name "Minimal Corp"
    And I click save
    Then I should see "Minimal Corp" in the companies list

  Scenario: Cancel company creation
    When I click "Add Company"
    And I fill in name "Cancelled Corp"
    And I click cancel
    Then I should not see "Cancelled Corp" in the companies list

  Scenario: Create company and assign users
    When I create a company "Test Corp"
    Then I should be able to assign users to "Test Corp"

  # === UPDATE COMPANY ===

  Scenario: Update company name
    Given there is a company named "Old Corp Name"
    When I select "Old Corp Name"
    And I click edit
    And I change the name to "New Corp Name"
    And I click save
    Then I should see "New Corp Name" in the companies list
    And I should not see "Old Corp Name" in the companies list

  Scenario: Update company description
    Given there is a company named "Descriptive Corp"
    When I select "Descriptive Corp"
    And I click edit
    And I change the description to "Updated description"
    And I click save
    Then the company description should be "Updated description"

  Scenario: Cancel company update
    Given there is a company named "Unchanged Corp"
    When I select "Unchanged Corp"
    And I click edit
    And I change the name to "Changed Name"
    And I click cancel
    Then I should see "Unchanged Corp" in the companies list

  # === DELETE COMPANY ===

  Scenario: Delete a company with no users
    Given there is a company "Empty Corp" with no users
    When I select "Empty Corp"
    And I click delete
    And I confirm the deletion
    Then I should not see "Empty Corp" in the companies list

  Scenario: Cannot delete company with users
    Given there is a company "Active Corp" with users
    When I select "Active Corp"
    And I click delete
    Then I should see a warning about users in the company
    And the company should not be deleted

  Scenario: Delete company with reassignment
    Given there is a company "Closing Corp" with users
    And there is another company "Target Corp"
    When I select "Closing Corp"
    And I click delete
    And I choose to reassign users to "Target Corp"
    And I confirm the deletion
    Then "Closing Corp" should be deleted
    And users should be moved to "Target Corp"

  Scenario: Cancel company deletion
    Given there is a company named "Keep Corp"
    When I select "Keep Corp"
    And I click delete
    And I cancel the dialog
    Then I should see "Keep Corp" in the companies list

  # === VALIDATION ===

  @validation
  Scenario: Company name is required
    When I click "Add Company"
    And I leave name empty
    And I click save
    Then I should see a validation error for name

  @validation
  Scenario: Company name must be unique
    Given there is a company named "Existing Corp"
    When I try to create a company named "Existing Corp"
    Then I should see an error about duplicate name

  @validation
  Scenario: Company name maximum length
    When I click "Add Company"
    And I fill in name with 256 characters
    And I click save
    Then I should see a validation error for name length

  # === VIEW COMPANY USERS ===

  Scenario: View users in a company
    Given there is a company "View Corp" with 5 users
    When I select "View Corp"
    Then I should see the list of users in "View Corp"
    And I should see 5 users

  Scenario: Navigate to user from company view
    Given there is a company with user "John Doe"
    When I view the company
    And I click on "John Doe"
    Then I should navigate to the user details

  # === COMPANY STATISTICS ===

  Scenario: Company shows user count
    Given there is a company with 10 users
    When I view the companies list
    Then the company should show "10 users"

  Scenario: Empty company shows zero users
    Given there is a company with no users
    When I view the companies list
    Then the company should show "0 users"

  # === SEARCH AND FILTER ===

  @search
  Scenario: Search companies by name
    Given there are companies "Acme Corp" and "Beta Corp"
    When I search for "Acme"
    Then I should see "Acme Corp"
    And I should not see "Beta Corp"

  Scenario: Clear search shows all companies
    Given I have searched for "Acme"
    When I clear the search
    Then I should see all companies

  # === EMPTY STATE ===

  @display
  Scenario: Empty state when no companies exist
    Given there are no companies
    Then I should see an empty state message
    And I should see "Add your first company" button

  # === LOADING STATES ===

  @ui
  Scenario: Loading indicator while fetching companies
    When the companies list is loading
    Then I should see a loading spinner

  @ui
  Scenario: Form submission shows loading state
    When I submit the create company form
    Then the submit button should show loading state

  # === ERROR HANDLING ===

  @error
  Scenario: Handle network error when loading companies
    Given the API is unavailable
    When I try to load companies
    Then I should see an error message
    And I should see a retry button

  @error
  Scenario: Handle error when creating company fails
    Given the API returns an error on create
    When I try to create a company
    Then I should see an error notification
