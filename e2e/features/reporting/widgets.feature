@reporting @widgets @display
Feature: Widget Display and Rendering

  As a user
  I want to view dashboard widgets
  So that I can visualize data insights

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the reporting page

  # === WIDGET GRID DISPLAY ===

  @smoke
  Scenario: Dashboard displays widget grid
    Given there is a dashboard named "Analytics Dashboard"
    When I select "Analytics Dashboard"
    Then I should see the widget grid
    And widgets should be arranged according to their positions

  Scenario: Empty dashboard shows placeholder
    Given there is a dashboard with no widgets
    When I select the dashboard
    Then I should see an empty state
    And I should see "Add Widget" prompt

  Scenario: Widget grid respects positions
    Given there is a dashboard with positioned widgets
    When I view the dashboard
    Then widgets should be at their specified grid positions

  # === METRIC WIDGET ===

  @AC-RPT-07
  Scenario: Metric widget displays large value
    Given there is a metric widget "Total Revenue"
    When I view the widget
    Then I should see a large numeric value
    And the value should be formatted appropriately

  Scenario: Metric widget shows trend indicator
    Given there is a metric widget with trend data
    When I view the widget
    Then I should see an up or down arrow
    And I should see the change percentage

  Scenario: Metric widget shows sparkline
    Given there is a metric widget with historical data
    When I view the widget
    Then I should see a mini trend line (sparkline)

  Scenario: Metric widget shows comparison
    Given there is a metric widget with comparison period
    When I view the widget
    Then I should see the current value
    And I should see the comparison value

  Scenario: Metric widget positive trend is green
    Given there is a metric widget with positive change
    When I view the widget
    Then the trend indicator should be green

  Scenario: Metric widget negative trend is red
    Given there is a metric widget with negative change
    When I view the widget
    Then the trend indicator should be red

  # === LINE CHART WIDGET ===

  @AC-RPT-07
  Scenario: Line chart widget renders correctly
    Given there is a line chart widget "Sales Trend"
    When I view the widget
    Then I should see a line chart
    And the chart should have X and Y axes

  Scenario: Line chart shows axis labels
    Given there is a line chart widget
    When I view the widget
    Then X axis should have time labels
    And Y axis should have value labels

  Scenario: Line chart shows legend
    Given there is a line chart with multiple series
    When I view the widget
    Then I should see a legend identifying each series

  Scenario: Line chart hover shows tooltip
    Given there is a line chart widget
    When I hover over a data point
    Then I should see a tooltip with the value

  Scenario: Line chart with multiple lines
    Given there is a line chart with 3 data series
    When I view the widget
    Then I should see 3 distinct lines
    And each line should have a different color

  # === BAR CHART WIDGET ===

  @AC-RPT-07
  Scenario: Bar chart widget renders correctly
    Given there is a bar chart widget "Monthly Sales"
    When I view the widget
    Then I should see a bar chart
    And bars should be visible for each category

  Scenario: Bar chart shows values on bars
    Given there is a bar chart widget
    When I view the widget
    Then each bar should display its value

  Scenario: Bar chart hover shows tooltip
    Given there is a bar chart widget
    When I hover over a bar
    Then I should see a tooltip with details

  Scenario: Horizontal bar chart
    Given there is a horizontal bar chart widget
    When I view the widget
    Then bars should be horizontal

  Scenario: Stacked bar chart
    Given there is a stacked bar chart widget
    When I view the widget
    Then bars should be stacked
    And I should see a legend

  # === PIE/DONUT CHART WIDGET ===

  @AC-RPT-07
  Scenario: Pie chart widget renders correctly
    Given there is a pie chart widget "Revenue by Region"
    When I view the widget
    Then I should see a pie/donut chart
    And slices should represent proportions

  Scenario: Pie chart shows legend
    Given there is a pie chart widget
    When I view the widget
    Then I should see a legend
    And legend should show each category

  Scenario: Pie chart shows percentages
    Given there is a pie chart widget
    When I view the widget
    Then each slice should show its percentage

  Scenario: Pie chart hover shows details
    Given there is a pie chart widget
    When I hover over a slice
    Then I should see the category name
    And I should see the value

  Scenario: Donut chart shows center value
    Given there is a donut chart widget
    When I view the widget
    Then the center should show a summary value

  # === TABLE WIDGET ===

  @AC-RPT-07
  Scenario: Table widget displays data
    Given there is a table widget "Top Customers"
    When I view the widget
    Then I should see a data table
    And the table should have rows and columns

  Scenario: Table widget shows column headers
    Given there is a table widget
    When I view the widget
    Then I should see column headers
    And headers should match query fields

  Scenario: Table widget supports sorting
    Given there is a table widget
    When I click on a column header
    Then the table should sort by that column

  Scenario: Table widget shows pagination
    Given there is a table widget with many rows
    When I view the widget
    Then I should see pagination controls

  Scenario: Table widget row click
    Given there is a table widget with clickable rows
    When I click on a row
    Then I should see row details or navigate

  # === TEXT WIDGET ===

  @AC-RPT-07
  Scenario: Text widget displays content
    Given there is a text widget "Dashboard Info"
    When I view the widget
    Then I should see the text content

  Scenario: Text widget supports markdown
    Given there is a text widget with markdown
    When I view the widget
    Then the markdown should be rendered

  Scenario: Text widget with links
    Given there is a text widget with links
    When I view the widget
    Then links should be clickable

  # === WIDGET LOADING STATES ===

  @ui
  Scenario: Widget shows loading state
    Given there is a widget loading data
    When I view the dashboard
    Then the widget should show a loading spinner

  Scenario: Widget shows skeleton while loading
    Given the dashboard is loading
    Then widgets should show skeleton placeholders

  Scenario: Widgets load independently
    Given there are multiple widgets
    When some widgets load faster than others
    Then faster widgets should display immediately
    And slower widgets should still show loading

  # === WIDGET ERROR STATES ===

  @error
  Scenario: Widget shows error when query fails
    Given there is a widget with a failing query
    When I view the dashboard
    Then the widget should show an error message

  Scenario: Widget error shows retry option
    Given a widget is in error state
    Then I should see a retry button

  Scenario: Widget error shows helpful message
    Given a widget query fails
    Then the error message should explain the issue

  Scenario: Retry widget reloads data
    Given a widget is in error state
    When I click retry
    Then the widget should attempt to reload

  # === WIDGET REFRESH ===

  Scenario: Widget refresh updates data
    When I click refresh on a widget
    Then the widget should reload its data
    And display updated values

  Scenario: Widgets refresh together
    When I click "Refresh All"
    Then all widgets should reload

  Scenario: Auto-refresh updates widgets
    Given auto-refresh is enabled
    Then widgets should update periodically

  # === WIDGET INTERACTIVITY ===

  Scenario: Widget supports drill-down
    Given there is a chart widget with drill-down
    When I click on a data point
    Then I should see more detailed data

  Scenario: Widget filter affects display
    Given there is a dashboard filter
    When I apply a filter
    Then widget data should update accordingly

  # === RESPONSIVE WIDGETS ===

  @mobile
  Scenario: Widgets resize on mobile
    Given I am on a mobile device
    When I view the dashboard
    Then widgets should resize appropriately

  @mobile
  Scenario: Charts remain readable on mobile
    Given I am on a mobile device
    When I view a chart widget
    Then the chart should be readable
    And touch interactions should work
