@transformation
Feature: Pipeline Steps Management

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the transformation page
    And there is a pipeline named "Test Pipeline"
    And I select "Test Pipeline"

  Scenario: Add a filter step
    When I click "Add Step"
    And I select step type "filter"
    And I configure the filter condition "status = 'active'"
    And I click save step
    Then I should see "Filter" in the canvas list

  Scenario: Add a map step
    When I click "Add Step"
    And I select step type "map"
    And I configure the mapping expression "fullName = firstName + ' ' + lastName"
    And I click save step
    Then I should see "Map" in the canvas list

  Scenario: Delete a step
    When I click "Add Step"
    And I select step type "filter"
    And I click save step
    And I select "Filter"
    And I click delete step
    Then I should not see "Filter" in the canvas list
