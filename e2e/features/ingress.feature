Feature: Ingress - Data Source Management

  Scenario: User can see the data sources list
    Given I am on the ingress page
    Then I should see the data sources list

  Scenario: User can create a new data source
    Given I am on the ingress page
    When I fill in source name "Test Database"
    And I select source type "database"
    And I save the source
    Then I should see "Test Database" in the sources list

  Scenario: User can test a connection
    Given I am on the ingress page
    And there is an existing data source
    When I click test connection
    Then I should see the status change to "testing"
