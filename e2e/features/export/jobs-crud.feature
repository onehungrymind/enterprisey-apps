@export @crud
Feature: Export Job Management

  As a data engineer
  I want to manage export jobs
  So that I can export data in various formats

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the export page

  # === SMOKE TESTS ===

  @smoke @AC-EXP-01
  Scenario: View export page layout
    Then I should see the export form
    And the form should have name field
    And the form should have query selection
    And the form should have format selection
    And I should see the active jobs section
    And I should see the job history section

  @smoke
  Scenario: View active jobs section
    Given there are active export jobs
    Then I should see the active jobs list
    And each job should show name and progress

  @smoke
  Scenario: View job history section
    Given there are completed export jobs
    Then I should see the job history list
    And each job should show name, status, and completion time

  # === CREATE JOB ===

  @AC-EXP-02
  Scenario: Create an export job with CSV format
    Given there is a ReportQuery named "Sales Query"
    When I fill in name "Monthly Report"
    And I select query "Sales Query"
    And I select format "csv"
    And I click "Start Export"
    Then a new job should appear in the active jobs section
    And its status should be "queued" initially

  Scenario: Create an export job with JSON format
    Given there is a ReportQuery named "Customer Query"
    When I fill in name "Customer Export"
    And I select query "Customer Query"
    And I select format "json"
    And I click "Start Export"
    Then the job should be created with format "json"

  Scenario: Create an export job with XLSX format
    Given there is a ReportQuery named "Report Query"
    When I fill in name "Excel Export"
    And I select query "Report Query"
    And I select format "xlsx"
    And I click "Start Export"
    Then the job should be created with format "xlsx"

  Scenario: Create an export job with PDF format
    Given there is a ReportQuery named "PDF Query"
    When I fill in name "PDF Report"
    And I select query "PDF Query"
    And I select format "pdf"
    And I click "Start Export"
    Then the job should be created with format "pdf"

  Scenario: Create job sets createdBy to current user
    When I create an export job "My Export"
    Then the job's createdBy should be my user ID

  # === FORMAT SELECTION ===

  @AC-EXP-03
  Scenario: Available export formats
    When I view the format selector
    Then the available formats should be "csv", "json", "xlsx", "pdf"

  @AC-EXP-03
  Scenario: Default format is CSV
    When I open the create job form
    Then the default format should be "csv"

  @AC-EXP-03
  Scenario: Change format selection
    When I select format "xlsx"
    Then the selected format should update to "xlsx"

  Scenario: Format selection persists during form completion
    When I select format "json"
    And I fill in other fields
    Then the format should still be "json"

  # === DELETE JOB ===

  Scenario: Delete a completed job
    Given there is a completed job "Old Export"
    When I click delete on "Old Export"
    And I confirm the deletion
    Then "Old Export" should not appear in job history

  Scenario: Delete a failed job
    Given there is a failed job "Failed Export"
    When I click delete on "Failed Export"
    And I confirm the deletion
    Then "Failed Export" should not appear in job history

  Scenario: Cancel job deletion
    Given there is a completed job "Keep This Job"
    When I click delete on "Keep This Job"
    And I cancel the dialog
    Then "Keep This Job" should still appear in job history

  # === VALIDATION ===

  @validation
  Scenario: Job name is required
    When I leave name empty
    And I select a query
    And I click "Start Export"
    Then I should see a validation error for name

  @validation
  Scenario: Query selection is required
    When I fill in name "Test Export"
    And I do not select a query
    And I click "Start Export"
    Then I should see a validation error for query

  @validation @INV-EXP-07
  Scenario: Format must be valid
    When I fill in name "Test Export"
    And I select a query
    And the format is somehow invalid
    Then the form should not submit

  # === JOB HISTORY ===

  @AC-EXP-08
  Scenario: Job history shows completed jobs
    Given there are completed export jobs
    When I view job history
    Then I should see completed jobs

  @AC-EXP-08
  Scenario: Job history shows failed jobs
    Given there are failed export jobs
    When I view job history
    Then I should see failed jobs
    And failed jobs should display error messages

  @AC-EXP-08
  Scenario: Job history shows cancelled jobs
    Given there are cancelled export jobs
    When I view job history
    Then I should see cancelled jobs

  Scenario: Job history excludes active jobs
    Given there are active export jobs
    When I view job history
    Then active jobs should not appear in history

  Scenario: Job history sorted by completion time
    Given there are multiple completed jobs
    When I view job history
    Then jobs should be sorted by completion time descending

  Scenario: Job history pagination
    Given there are more than 10 completed jobs
    When I view job history
    Then I should see pagination controls
    And I can navigate to older jobs

  # === SCHEDULED EXPORTS ===

  @AC-EXP-09
  Scenario: Create a scheduled export
    When I fill in name "Daily Export"
    And I select query "Daily Query"
    And I set schedule cron "0 8 * * *"
    And I click "Save Schedule"
    Then the job should be created with schedule

  @AC-EXP-09
  Scenario: View scheduled export details
    Given there is a scheduled job "Weekly Report"
    When I view "Weekly Report" details
    Then I should see the schedule information
    And I should see next scheduled run time

  Scenario: Edit scheduled export
    Given there is a scheduled job "Monthly Report"
    When I edit the schedule to "0 0 1 * *"
    And I save changes
    Then the schedule should be updated

  Scenario: Disable scheduled export
    Given there is a scheduled job "Active Schedule"
    When I disable the schedule
    Then the job should not run automatically

  # === EMPTY STATE ===

  @display
  Scenario: Empty state for active jobs
    Given there are no active jobs
    Then I should see an empty state for active jobs
    And I should see a message about starting exports

  @display
  Scenario: Empty state for job history
    Given there are no completed jobs
    Then I should see an empty state for job history

  # === LOADING STATES ===

  @ui
  Scenario: Loading indicator while fetching jobs
    When the jobs list is loading
    Then I should see a loading spinner

  @ui
  Scenario: Form submission shows loading state
    When I submit the create job form
    Then the submit button should show loading state
    And I should not be able to submit again

  # === ERROR HANDLING ===

  @error
  Scenario: Handle network error when loading jobs
    Given the API is unavailable
    When I try to load jobs
    Then I should see an error message
    And I should see a retry button

  @error
  Scenario: Handle error when creating job fails
    Given the API returns an error on create
    When I try to create a job
    Then I should see an error notification
    And the form should remain open
