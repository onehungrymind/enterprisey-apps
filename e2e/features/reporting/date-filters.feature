@reporting @filters
Feature: Dashboard Date Filtering

  As a data analyst
  I want to filter dashboard data by date range
  So that I can analyze time-specific metrics

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the reporting page
    And I have selected dashboard "Sales Dashboard"

  # === PRESET DATE FILTERS ===

  Scenario: Filter by 7 days
    When I click the "7D" filter
    Then the "7D" filter should be active
    And widgets should refresh with 7-day data
    And data should be from the last 7 days

  Scenario: Filter by 30 days
    When I click the "30D" filter
    Then the "30D" filter should be active
    And widgets should refresh with 30-day data

  Scenario: Filter by 90 days
    When I click the "90D" filter
    Then the "90D" filter should be active
    And widgets should refresh with 90-day data

  Scenario: Filter by 12 months
    When I click the "12M" filter
    Then the "12M" filter should be active
    And widgets should refresh with 12-month data

  Scenario: Filter by Year to Date
    When I click the "YTD" filter
    Then the "YTD" filter should be active
    And data should be from January 1st to today

  Scenario: Filter by Month to Date
    When I click the "MTD" filter
    Then the "MTD" filter should be active
    And data should be from the 1st of current month

  # === DEFAULT FILTER ===

  Scenario: Dashboard loads with default filter
    When I open a dashboard with default filter "30D"
    Then the "30D" filter should be active
    And widgets should show 30-day data

  Scenario: Dashboard remembers last used filter
    Given I applied the "90D" filter
    When I navigate away and return
    Then the "90D" filter should still be active

  # === CUSTOM DATE RANGE ===

  Scenario: Select custom date range
    When I click "Custom Range"
    And I select start date "2024-01-01"
    And I select end date "2024-03-31"
    And I apply the filter
    Then widgets should show data for Q1 2024

  Scenario: Custom range with date picker
    When I click "Custom Range"
    Then I should see a date picker
    And I can select start and end dates
    And I can apply the custom range

  Scenario: Custom range validates dates
    When I select start date after end date
    Then I should see a validation error
    And I should not be able to apply the filter

  Scenario: Custom range maximum span
    When I select a date range spanning more than 2 years
    Then I should see a warning about performance
    And I should be able to proceed if I choose

  # === FILTER PERSISTENCE ===

  Scenario: Filter persists across widget refreshes
    Given I have applied the "30D" filter
    When I refresh a widget
    Then the widget should still use "30D" data

  Scenario: Filter applies to all widgets
    Given there are multiple widgets on the dashboard
    When I apply the "7D" filter
    Then all widgets should update with 7-day data

  Scenario: Filter state shown in URL
    When I apply the "90D" filter
    Then the URL should reflect the filter state
    And sharing the URL should preserve the filter

  # === FILTER COMPARISON ===

  Scenario: Compare with previous period
    Given the "30D" filter is active
    When I enable "Compare with previous period"
    Then widgets should show current and previous 30-day data
    And comparison indicators should appear

  Scenario: Compare with same period last year
    Given the "MTD" filter is active
    When I select "Compare with same period last year"
    Then widgets should show year-over-year comparison

  # === FILTER RESET ===

  @AC-RPT-10
  Scenario: Reset filter to default
    Given I have applied a custom filter
    When I click "Reset"
    Then the filter should revert to the dashboard default
    And widgets should refresh

  Scenario: Clear all filters
    Given I have applied multiple filters
    When I click "Clear All Filters"
    Then all filters should be cleared
    And widgets should show unfiltered data

  # === FILTER INTERACTIONS ===

  Scenario: Switching filters shows loading state
    Given the "30D" filter is active
    When I click the "90D" filter
    Then widgets should show loading indicators
    And then update with new data

  Scenario: Rapid filter switching debounces requests
    When I quickly click "7D" then "30D" then "90D"
    Then only the final filter should be applied
    And I should see "90D" data

  # === FILTER WITH OTHER CONTROLS ===

  Scenario: Date filter works with dashboard filters
    Given the dashboard has a region filter
    When I apply "30D" date filter
    And I select region "North America"
    Then widgets should show 30-day data for North America

  Scenario: Date filter and search work together
    Given I have applied the "7D" filter
    When I search within widget data
    Then search should apply to the 7-day filtered data

  # === TIME ZONE HANDLING ===

  Scenario: Filter respects user timezone
    Given my timezone is "America/New_York"
    When I apply the "7D" filter
    Then date boundaries should be in my timezone

  Scenario: UTC indicator shown
    When I view date filtered data
    Then I should see the timezone indicator
    And dates should be displayed in local time

  # === MOBILE RESPONSIVENESS ===

  @mobile
  Scenario: Date filters accessible on mobile
    Given I am on a mobile device
    When I view the dashboard
    Then date filter controls should be accessible
    And I can apply filters

  @mobile
  Scenario: Custom date picker works on mobile
    Given I am on a mobile device
    When I open the custom date picker
    Then it should be touch-friendly
    And I can select dates
