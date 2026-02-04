Feature: Authentication

  Scenario: User can log in with valid credentials
    Given I am on the login page
    When I enter email "admin@test.com"
    And I enter password "admin"
    And I submit the login form
    Then I should be redirected to the dashboard
