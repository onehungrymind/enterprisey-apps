@export @execution
Feature: Export Job Execution

  As a data engineer
  I want to track export job execution
  So that I can monitor progress and download results

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the export page

  # === JOB STATUS TRANSITIONS ===

  @INV-EXP-01
  Scenario: New job starts as queued
    When I create a new export job
    Then the job status should be "queued"

  @INV-EXP-01
  Scenario: Job transitions from queued to processing
    Given there is a queued job "Processing Job"
    When the job starts processing
    Then the status should change to "processing"
    And startedAt should be set

  @INV-EXP-01
  Scenario: Job transitions from processing to completed
    Given there is a processing job "Completing Job"
    When the job completes successfully
    Then the status should change to "completed"
    And completedAt should be set

  @INV-EXP-01
  Scenario: Job transitions from processing to failed
    Given there is a processing job "Failing Job"
    When the job encounters an error
    Then the status should change to "failed"
    And error message should be set

  # === PROGRESS TRACKING ===

  @AC-EXP-04
  Scenario: Progress bar shows current progress
    Given there is a processing job with progress 45
    When I view the active jobs
    Then I should see a progress bar at 45%

  @AC-EXP-04 @INV-EXP-04
  Scenario: Progress is between 0 and 100
    Given there is a processing job
    When I observe the progress
    Then progress should be between 0 and 100

  @AC-EXP-04 @INV-EXP-03
  Scenario: Progress never decreases
    Given there is a processing job
    When I observe the progress over time
    Then progress should only increase or stay the same

  @AC-EXP-04
  Scenario: Progress updates in 10-20% increments
    Given there is a processing job at 30%
    When the next progress update occurs
    Then progress should be between 40% and 50%

  Scenario: Completed job shows 100% progress
    Given there is a completed job
    When I view the job
    Then the progress should be 100%

  # === POLLING BEHAVIOR ===

  @AC-EXP-05
  Scenario: Polling starts when active jobs exist
    Given there are active export jobs
    When I am on the export page
    Then the frontend should poll for updates

  @AC-EXP-05 @INV-EXP-06
  Scenario: Polling stops when no active jobs
    Given all jobs have reached terminal status
    When I observe the polling behavior
    Then polling should stop automatically

  @AC-EXP-05
  Scenario: Polling updates job progress
    Given there is a processing job
    When the frontend polls for updates
    Then the progress should reflect the latest value

  Scenario: Polling interval is appropriate
    Given there are active jobs
    When I observe polling
    Then polls should occur at reasonable intervals

  # === CANCEL JOB ===

  @AC-EXP-06 @INV-EXP-02
  Scenario: Cancel a queued job
    Given there is a queued job "Cancel Queued"
    When I click "Cancel" on the job
    Then the job status should change to "cancelled"
    And the job should no longer appear in active jobs

  @AC-EXP-06 @INV-EXP-02
  Scenario: Cancel a processing job
    Given there is a processing job "Cancel Processing"
    When I click "Cancel" on the job
    Then the job status should change to "cancelled"
    And processing should stop

  @INV-EXP-02
  Scenario: Cannot cancel completed job
    Given there is a completed job
    Then the cancel button should not be available

  @INV-EXP-02
  Scenario: Cannot cancel failed job
    Given there is a failed job
    Then the cancel button should not be available

  @INV-EXP-02
  Scenario: Cannot cancel already cancelled job
    Given there is a cancelled job
    Then the cancel button should not be available

  Scenario: Cancel confirmation dialog
    Given there is a processing job
    When I click "Cancel" on the job
    Then I should see a confirmation dialog
    When I confirm the cancellation
    Then the job should be cancelled

  # === COMPLETED JOB DETAILS ===

  @AC-EXP-07 @INV-EXP-05
  Scenario: Completed job has output URL
    Given an export job has completed
    When I view the job details
    Then I should see a download link
    And the outputUrl should be set

  @AC-EXP-07 @INV-EXP-05
  Scenario: Completed job shows file size
    Given an export job has completed
    When I view the job details
    Then I should see the file size

  @AC-EXP-07 @INV-EXP-05
  Scenario: Completed job shows record count
    Given an export job has completed
    When I view the job details
    Then I should see the record count

  Scenario: Completed job shows duration
    Given an export job has completed
    When I view the job details
    Then I should see the execution duration
    And I should see startedAt and completedAt

  # === DOWNLOAD EXPORT ===

  @AC-EXP-07
  Scenario: Download completed export
    Given there is a completed job "Sales Export"
    When I click "Download" on "Sales Export"
    Then a file should be downloaded
    And the file should have the correct format

  Scenario: Download shows correct file name
    Given there is a completed job "Monthly Report" with format "csv"
    When I download the file
    Then the file name should contain "Monthly Report"
    And the file extension should be ".csv"

  Scenario: Download JSON export
    Given there is a completed job with format "json"
    When I download the file
    Then the file should be valid JSON

  Scenario: Download XLSX export
    Given there is a completed job with format "xlsx"
    When I download the file
    Then the file should be valid Excel format

  # === FAILED JOB DETAILS ===

  Scenario: Failed job shows error message
    Given there is a failed job "Error Job"
    When I view "Error Job" details
    Then I should see the error message
    And the error should be descriptive

  Scenario: Failed job can be retried
    Given there is a failed job "Retry Job"
    When I click "Retry" on "Retry Job"
    Then a new job should be created
    And it should start processing

  # === UI STATES ===

  @ui
  Scenario: Processing job shows spinner
    Given there is a processing job
    When I view the active jobs
    Then the job should show a loading spinner

  @ui
  Scenario: Completed job shows success indicator
    Given there is a completed job
    When I view the job history
    Then the job should show a success checkmark

  @ui
  Scenario: Failed job shows error indicator
    Given there is a failed job
    When I view the job history
    Then the job should show an error indicator

  @ui
  Scenario: Cancelled job shows cancelled indicator
    Given there is a cancelled job
    When I view the job history
    Then the job should show a cancelled indicator

  # === CONCURRENT JOBS ===

  Scenario: Multiple jobs can run concurrently
    Given I create two export jobs
    Then both jobs should appear in active jobs
    And both should process independently

  Scenario: Jobs complete in any order
    Given there are multiple processing jobs
    When jobs complete
    Then they may complete in any order
    And all should eventually move to history

  # === ERROR HANDLING ===

  @error
  Scenario: Job fails with detailed error
    Given there is a job that will fail
    When the job fails
    Then the error message should explain the failure

  @error
  Scenario: Handle timeout errors
    Given there is a job that will timeout
    When the job times out
    Then the status should be "failed"
    And error should mention timeout

  @error
  Scenario: Handle query execution errors
    Given there is a job with an invalid query
    When the job processes
    Then it should fail with query error details
