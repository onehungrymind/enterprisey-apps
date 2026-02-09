@reporting @widgets
Feature: Widget CRUD Operations

  As a data analyst
  I want to manage widgets on dashboards
  So that I can visualize specific metrics and data

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the reporting page
    And there is a dashboard named "Test Dashboard"
    And I have selected "Test Dashboard"

  # === ADD WIDGET ===

  @AC-RPT-06
  Scenario: Add a bar chart widget
    Given there is a ReportQuery named "Revenue Query"
    When I click "Add Widget"
    And I select widget type "bar_chart"
    And I fill in title "Revenue Chart"
    And I select query "Revenue Query"
    And I set position x: 0, y: 0, w: 6, h: 4
    And I click save widget
    Then the widget "Revenue Chart" should appear on the dashboard
    And it should be positioned at the specified location

  Scenario: Add a line chart widget
    Given there is a ReportQuery named "Trend Query"
    When I click "Add Widget"
    And I select widget type "line_chart"
    And I fill in title "Trend Line"
    And I select query "Trend Query"
    And I click save widget
    Then the widget "Trend Line" should appear on the dashboard

  Scenario: Add a pie chart widget
    Given there is a ReportQuery named "Distribution Query"
    When I click "Add Widget"
    And I select widget type "pie_chart"
    And I fill in title "Distribution Chart"
    And I select query "Distribution Query"
    And I click save widget
    Then the widget "Distribution Chart" should appear on the dashboard

  Scenario: Add a metric widget
    Given there is a ReportQuery named "Total Revenue Query"
    When I click "Add Widget"
    And I select widget type "metric"
    And I fill in title "Total Revenue"
    And I select query "Total Revenue Query"
    And I click save widget
    Then the widget "Total Revenue" should appear as a metric card

  Scenario: Add a table widget
    Given there is a ReportQuery named "Details Query"
    When I click "Add Widget"
    And I select widget type "table"
    And I fill in title "Data Table"
    And I select query "Details Query"
    And I click save widget
    Then the widget "Data Table" should appear as a data table

  Scenario: Add a text widget without query
    When I click "Add Widget"
    And I select widget type "text"
    And I fill in title "Info Text"
    And I fill in text content "This is informational text"
    And I click save widget
    Then the widget "Info Text" should appear as text content

  Scenario: Cancel widget creation
    When I click "Add Widget"
    And I fill in title "Cancelled Widget"
    And I click cancel
    Then I should not see "Cancelled Widget" on the dashboard

  # === WIDGET TYPE RENDERING ===

  @AC-RPT-07
  Scenario: Table widget renders as data table
    Given the dashboard has a table widget
    When I view the dashboard
    Then the table widget should render as a data table
    And it should have column headers
    And it should have data rows

  @AC-RPT-07
  Scenario: Bar chart widget renders correctly
    Given the dashboard has a bar_chart widget
    When I view the dashboard
    Then the widget should render as a bar chart
    And bars should be visible

  @AC-RPT-07
  Scenario: Line chart widget renders correctly
    Given the dashboard has a line_chart widget
    When I view the dashboard
    Then the widget should render as a line chart
    And the line should be visible

  @AC-RPT-07
  Scenario: Pie chart widget renders correctly
    Given the dashboard has a pie_chart widget
    When I view the dashboard
    Then the widget should render as a donut/pie chart
    And I should see a legend

  @AC-RPT-07
  Scenario: Metric widget renders as single value
    Given the dashboard has a metric widget
    When I view the dashboard
    Then the metric widget should display a large value
    And it should display a change indicator
    And it should display a sparkline

  @AC-RPT-07
  Scenario: Text widget renders as content block
    Given the dashboard has a text widget
    When I view the dashboard
    Then the text widget should render the text content

  # === WIDGET POSITIONING ===

  @AC-RPT-08 @INV-RPT-01
  Scenario: Widget position uses grid coordinates
    Given I add a widget with position x: 2, y: 1, w: 4, h: 3
    When I view the dashboard
    Then the widget should be at grid position 2, 1
    And the widget should have width 4 and height 3

  @INV-RPT-01
  Scenario: Widget position values must be valid
    When I try to add a widget with position x: -1, y: 0, w: 4, h: 3
    Then I should see a validation error for position

  @INV-RPT-01
  Scenario: Widget dimensions must be positive
    When I try to add a widget with position x: 0, y: 0, w: 0, h: 3
    Then I should see a validation error for dimensions

  Scenario: Drag and drop widget to new position
    Given there is a widget on the dashboard
    When I drag the widget to a new position
    Then the widget position should be updated

  Scenario: Resize widget
    Given there is a widget on the dashboard
    When I resize the widget
    Then the widget dimensions should be updated

  # === UPDATE WIDGET ===

  Scenario: Update widget title
    Given there is a widget named "Old Widget Title"
    When I click edit on the widget
    And I change the title to "New Widget Title"
    And I click save widget
    Then the widget should display "New Widget Title"

  Scenario: Change widget query
    Given there is a widget using query "Query A"
    And there is another query "Query B"
    When I click edit on the widget
    And I select query "Query B"
    And I click save widget
    Then the widget should use "Query B"

  Scenario: Change widget type
    Given there is a bar_chart widget
    When I click edit on the widget
    And I change type to "line_chart"
    And I click save widget
    Then the widget should render as a line chart

  Scenario: Update widget configuration
    Given there is a bar_chart widget
    When I click edit on the widget
    And I change the color scheme to "blue"
    And I click save widget
    Then the widget should use the new color scheme

  # === DELETE WIDGET ===

  Scenario: Delete a widget
    Given there is a widget named "Delete Widget"
    When I click delete on the widget
    And I confirm the deletion
    Then I should not see "Delete Widget" on the dashboard

  Scenario: Cancel widget deletion
    Given there is a widget named "Keep Widget"
    When I click delete on the widget
    And I cancel the dialog
    Then I should see "Keep Widget" on the dashboard

  Scenario: Delete last widget shows empty state
    Given the dashboard has only one widget
    When I delete the widget
    Then I should see the empty state for widgets
    And I should see an "Add Widget" prompt

  # === VALIDATION ===

  @validation @INV-RPT-02
  Scenario: Non-text widget requires query
    When I add a widget of type "bar_chart"
    And I do not select a query
    And I click save widget
    Then I should see a validation error "Query is required"

  @validation
  Scenario: Widget title is required
    When I click "Add Widget"
    And I select widget type "metric"
    And I leave the title empty
    And I click save widget
    Then I should see a validation error for title

  @validation
  Scenario: Text widget does not require query
    When I add a widget of type "text"
    And I fill in title "Text Widget"
    And I fill in text content "Some text"
    And I do not select a query
    And I click save widget
    Then the widget should be created successfully

  # === LOADING AND ERROR STATES ===

  @ui
  Scenario: Widget shows loading state
    Given there is a widget with a slow query
    When the dashboard is loading
    Then the widget should show a loading spinner

  @ui
  Scenario: Widget shows error state
    Given there is a widget with a failing query
    When the widget fails to load
    Then the widget should show an error message
    And it should show a retry button

  Scenario: Retry failed widget
    Given a widget is showing an error
    When I click retry on the widget
    Then the widget should attempt to reload

  # === WIDGET REFRESH ===

  Scenario: Manual widget refresh
    Given there is a widget on the dashboard
    When I click refresh on the widget
    Then the widget should reload its data

  Scenario: All widgets refresh together
    Given there are multiple widgets on the dashboard
    When I click "Refresh All"
    Then all widgets should reload

  # === MULTIPLE WIDGETS ===

  Scenario: Dashboard can have multiple widgets
    Given I add 5 widgets to the dashboard
    Then I should see all 5 widgets on the grid

  Scenario: Widgets do not overlap
    Given there are widgets on the dashboard
    When I view the dashboard
    Then no widgets should overlap each other
