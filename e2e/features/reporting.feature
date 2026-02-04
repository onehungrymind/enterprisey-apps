Feature: Reporting - Dashboard Management

  Scenario: User can see the dashboards list
    Given I am on the reporting page
    Then I should see the dashboards list

  Scenario: User can select a dashboard
    Given I am on the reporting page
    And there is an existing dashboard
    When I select the dashboard
    Then I should see the dashboard viewer with widgets

  Scenario: User can view widget placeholders
    Given I am on the reporting page
    And there is a dashboard with widgets
    When I select the dashboard
    Then I should see widget cards for each widget type
