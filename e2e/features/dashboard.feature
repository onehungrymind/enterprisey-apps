Feature: Dashboard

  Scenario: User can see the dashboard home page
    Given I am on the dashboard
    Then I should see the home page

  Scenario: User can navigate to domain pages
    Given I am on the dashboard
    When I click the "Ingress" navigation link
    Then I should see the ingress page
