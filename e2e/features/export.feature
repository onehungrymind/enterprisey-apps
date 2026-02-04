Feature: Export - Job Queue Management

  Scenario: User can see the export page
    Given I am on the export page
    Then I should see the export form

  Scenario: User can start an export job
    Given I am on the export page
    When I fill in export name "Monthly Report"
    And I fill in query ID "query-1"
    And I select format "csv"
    And I click start export
    Then I should see the job in active jobs

  Scenario: User can see completed exports
    Given I am on the export page
    And there are completed export jobs
    Then I should see the job history with download links
