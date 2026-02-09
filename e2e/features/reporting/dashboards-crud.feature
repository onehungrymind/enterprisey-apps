@reporting @crud
Feature: Dashboard CRUD Operations

  As a data analyst
  I want to manage dashboards
  So that I can visualize data for stakeholders

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the reporting page

  # === SMOKE TESTS ===

  @smoke @AC-RPT-01
  Scenario: View dashboards list
    Then I should see the dashboards list
    And each dashboard should display its name
    And each dashboard should display its description
    And each dashboard should display widget count
    And each dashboard should display public/private status

  @smoke
  Scenario: Dashboards list shows creator information
    Given there are dashboards created by different users
    Then each dashboard should show "Created by" information

  # === SELECT DASHBOARD ===

  @AC-RPT-02
  Scenario: Select a dashboard to view
    Given there is a dashboard named "Sales Dashboard"
    When I select "Sales Dashboard"
    Then the dashboard viewer should open
    And I should see the widget grid
    And the dashboard name should be displayed in the header

  Scenario: Selected dashboard is highlighted
    Given there are dashboards "Dashboard A" and "Dashboard B"
    When I select "Dashboard B"
    Then "Dashboard B" should be highlighted in the sidebar

  Scenario: Navigate between dashboards
    Given there are dashboards "Dashboard A" and "Dashboard B"
    When I select "Dashboard A"
    Then I should see "Dashboard A" widgets
    When I select "Dashboard B"
    Then I should see "Dashboard B" widgets

  # === CREATE DASHBOARD ===

  @AC-RPT-03
  Scenario: Create a new dashboard with all fields
    When I click "New Dashboard"
    And I fill in name "Sales Overview"
    And I fill in description "Monthly sales metrics"
    And I click create
    Then I should see "Sales Overview" in the dashboards list
    And its createdBy should be the current user

  Scenario: Create a public dashboard
    When I click "New Dashboard"
    And I fill in name "Public Dashboard"
    And I fill in description "Visible to all users"
    And I check "Make public"
    And I click create
    Then I should see "Public Dashboard" in the dashboards list
    And it should show a public badge

  Scenario: Create a private dashboard
    When I click "New Dashboard"
    And I fill in name "Private Dashboard"
    And I fill in description "Only visible to me"
    And I uncheck "Make public"
    And I click create
    Then I should see "Private Dashboard" in the dashboards list
    And it should show a private badge

  Scenario: Created dashboard has no widgets initially
    When I create a new dashboard "Empty Dashboard"
    And I select "Empty Dashboard"
    Then the widget count should be 0
    And I should see an empty state message

  Scenario: Cancel dashboard creation
    When I click "New Dashboard"
    And I fill in name "Cancelled Dashboard"
    And I click cancel
    Then I should not see "Cancelled Dashboard" in the dashboards list

  # === UPDATE DASHBOARD ===

  @AC-RPT-04
  Scenario: Update dashboard name
    Given there is a dashboard named "Old Dashboard"
    When I select "Old Dashboard"
    And I click edit dashboard
    And I change the name to "Updated Dashboard"
    And I click save
    Then I should see "Updated Dashboard" in the dashboards list
    And I should not see "Old Dashboard" in the dashboards list

  Scenario: Update dashboard description
    Given there is a dashboard named "Descriptive Dashboard"
    When I select "Descriptive Dashboard"
    And I click edit dashboard
    And I change the description to "New detailed description"
    And I click save
    Then the dashboard description should be "New detailed description"

  Scenario: Toggle dashboard public/private status
    Given there is a private dashboard named "Toggle Dashboard"
    When I select "Toggle Dashboard"
    And I click edit dashboard
    And I check "Make public"
    And I click save
    Then "Toggle Dashboard" should show a public badge

  Scenario: Cancel dashboard update
    Given there is a dashboard named "Unchanged Dashboard"
    When I select "Unchanged Dashboard"
    And I click edit dashboard
    And I change the name to "Changed Name"
    And I click cancel
    Then I should see "Unchanged Dashboard" in the dashboards list

  # === DELETE DASHBOARD ===

  @AC-RPT-05
  Scenario: Delete a dashboard
    Given there is a dashboard named "Delete Me Dashboard"
    When I select "Delete Me Dashboard"
    And I click delete dashboard
    And I confirm the deletion
    Then I should not see "Delete Me Dashboard" in the dashboards list

  Scenario: Delete dashboard removes all widgets
    Given there is a dashboard "Dashboard With Widgets" containing 3 widgets
    When I delete the dashboard
    And I confirm the deletion
    Then the dashboard should be removed
    And all associated widgets should be removed

  Scenario: Cancel dashboard deletion
    Given there is a dashboard named "Keep This Dashboard"
    When I select "Keep This Dashboard"
    And I click delete dashboard
    And I cancel the dialog
    Then I should see "Keep This Dashboard" in the dashboards list

  # === VALIDATION ===

  @validation
  Scenario: Cannot create dashboard without name
    When I click "New Dashboard"
    And I fill in description "No name provided"
    And I click create
    Then I should see a validation error for name
    And the dashboard should not be created

  @validation @INV-RPT-03
  Scenario: Dashboard name must be non-empty
    When I click "New Dashboard"
    And I leave the name field empty
    And I click create
    Then I should see a validation error "Name is required"

  @validation
  Scenario: Dashboard name too long shows error
    When I click "New Dashboard"
    And I fill in name with 256 characters
    And I click create
    Then I should see a validation error for name length

  # === PUBLIC/PRIVATE VISIBILITY ===

  @AC-RPT-11
  Scenario: User can see their own dashboards
    Given I have created dashboards "My Dashboard 1" and "My Dashboard 2"
    When I view the dashboards list
    Then I should see "My Dashboard 1"
    And I should see "My Dashboard 2"

  @AC-RPT-11
  Scenario: User can see public dashboards from others
    Given user "other@example.com" created a public dashboard "Other Public"
    When I view the dashboards list
    Then I should see "Other Public"

  @AC-RPT-11
  Scenario: User cannot see private dashboards from others
    Given user "other@example.com" created a private dashboard "Other Private"
    When I view the dashboards list
    Then I should not see "Other Private"

  Scenario: Only creator can edit private dashboard
    Given user "other@example.com" created a private dashboard "Other Private"
    When I try to edit "Other Private"
    Then I should see an access denied message

  # === DASHBOARD FILTERS ===

  @AC-RPT-10
  Scenario: Dashboard with filters shows filter controls
    Given there is a dashboard with filters configured
    When I select the dashboard
    Then I should see filter controls

  @AC-RPT-10
  Scenario: Apply filter value updates widgets
    Given there is a dashboard with a date filter
    When I select a date range
    Then the widgets should refresh with filtered data

  @AC-RPT-10
  Scenario: Reset filters reverts to defaults
    Given there is a dashboard with filters applied
    When I click "Reset Filters"
    Then all filters should revert to their default values
    And widgets should refresh

  # === EMPTY STATE ===

  @display
  Scenario: Empty state when no dashboards exist
    Given there are no dashboards
    Then I should see an empty state message
    And I should see a "Create your first dashboard" button

  Scenario: Click empty state button opens create form
    Given there are no dashboards
    When I click "Create your first dashboard"
    Then I should see the dashboard creation form

  # === SEARCH AND FILTER ===

  @search
  Scenario: Search dashboards by name
    Given there are dashboards "Sales Dashboard" and "Marketing Dashboard"
    When I search for "Sales"
    Then I should see "Sales Dashboard"
    And I should not see "Marketing Dashboard"

  @filtering
  Scenario: Filter dashboards by public/private
    Given there are public and private dashboards
    When I filter by "Public"
    Then I should only see public dashboards

  Scenario: Clear search shows all dashboards
    Given I have searched for "Sales"
    When I clear the search
    Then I should see all accessible dashboards

  # === LOADING STATES ===

  @ui
  Scenario: Loading indicator while fetching dashboards
    When the dashboard list is loading
    Then I should see a loading spinner

  @ui
  Scenario: Loading indicator while creating dashboard
    When I submit the create dashboard form
    Then the create button should show a loading state

  # === ERROR HANDLING ===

  @error
  Scenario: Handle network error when loading dashboards
    Given the API is unavailable
    When I try to load dashboards
    Then I should see an error message
    And I should see a retry button

  @error
  Scenario: Handle error when creating dashboard fails
    Given the API returns an error on create
    When I try to create a dashboard
    Then I should see an error notification
    And the form should remain open
