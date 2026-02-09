@transformation @execution
Feature: Pipeline Execution

  As a data engineer
  I want to run transformation pipelines
  So that I can process data through the defined steps

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the transformation page

  # === RUN PIPELINE ===

  @smoke @AC-TRN-09
  Scenario: Run a pipeline successfully
    Given there is an active pipeline "Ready Pipeline" with steps
    When I select "Ready Pipeline"
    And I click "Run"
    Then a new run should appear with status "running"
    And the run should eventually complete with status "completed"
    And the pipeline lastRunAt should be updated

  Scenario: First run changes pipeline status to active
    Given there is a draft pipeline "First Run Pipeline" with steps
    When I run the pipeline
    And the run completes successfully
    Then the pipeline status should change to "active"

  Scenario: Run shows progress
    Given there is a pipeline with many records to process
    When I run the pipeline
    Then I should see a progress indicator
    And the records processed count should increase

  Scenario: Run captures records processed count
    Given there is a pipeline that processes 1000 records
    When the run completes
    Then the run should show 1000 records processed

  # === RUN FAILURES ===

  Scenario: Failed run sets pipeline to error status
    Given there is a pipeline that will fail during execution
    When I run the pipeline
    And the run fails
    Then the run status should be "failed"
    And the pipeline status should change to "error"
    And I should see the error message

  Scenario: Run failure captures error details
    Given a pipeline run fails
    Then the run should show which step failed
    And the run should show the error message
    And the run should show the failure timestamp

  Scenario: Can run pipeline again after failure
    Given there is a pipeline with status "error"
    When I fix the issue
    And I run the pipeline again
    Then a new run should be created

  # === RUN HISTORY ===

  @AC-TRN-10
  Scenario: View pipeline run history
    Given there is a pipeline with multiple runs
    When I select the pipeline
    And I click on "Run History"
    Then I should see a list of all past runs
    And runs should be ordered by startedAt descending
    And each run should show status, duration, and records processed

  Scenario: Run history shows execution duration
    Given there is a completed run
    When I view the run details
    Then I should see the start time
    And I should see the completion time
    And I should see the calculated duration

  Scenario: View failed run details
    Given there is a failed run for "Error Pipeline"
    When I click on the failed run
    Then I should see the error message
    And I should see which step caused the failure
    And I should see the stack trace or error details

  Scenario: Run history pagination
    Given a pipeline has more than 20 runs
    When I view the run history
    Then I should see pagination controls
    And I should be able to navigate to older runs

  # === PREVIEW ===

  @AC-TRN-11
  Scenario: Preview pipeline output
    Given there is a pipeline with steps
    When I select the pipeline
    And I click "Preview"
    Then I should see a preview of the transformed data
    And the preview should show column headers
    And the preview should show sample rows

  @AC-TRN-12
  Scenario: Preview with no steps shows source schema
    Given there is a pipeline with no steps
    When I click "Preview"
    Then the preview should show the raw source schema

  Scenario: Preview step-by-step transformation
    Given there is a pipeline with 3 steps
    When I click "Preview"
    And I select step 1
    Then I should see the data after step 1
    When I select step 2
    Then I should see the data after step 2

  @AC-TRN-14
  Scenario: Preview fetches source schema from Ingress API
    Given there is a pipeline referencing source "Remote Source"
    When I request a preview
    Then the system should fetch schema from the Ingress API
    And apply the transformation steps
    And show the resulting schema

  Scenario: Preview shows limited sample data
    Given there is a pipeline that would output millions of rows
    When I click "Preview"
    Then the preview should show only the first 100 rows
    And I should see a message indicating more data exists

  # === CONCURRENT RUNS ===

  @edge
  Scenario: Cannot start second run while first is running
    Given a pipeline run is in progress
    When I try to run the same pipeline again
    Then the "Run" button should be disabled
    And I should see a message about run in progress

  Scenario: Different pipelines can run concurrently
    Given there are active pipelines "Pipeline A" and "Pipeline B"
    When I run "Pipeline A"
    And I run "Pipeline B"
    Then both runs should proceed independently

  # === RUN CANCELLATION ===

  @edge
  Scenario: Cancel a running pipeline
    Given a pipeline run is in progress
    When I click "Cancel Run"
    And I confirm the cancellation
    Then the run status should change to "cancelled"
    And the pipeline should not be in error state

  # === UI STATES ===

  @ui
  Scenario: Run button disabled for draft pipeline without steps
    Given there is a draft pipeline with no steps
    Then the "Run" button should be disabled
    And I should see a tooltip about adding steps first

  Scenario: Run button shows loading state
    When I click "Run"
    Then the button should show a loading spinner
    And the button text should change to "Running..."

  Scenario: Run history tab shows unread indicator
    Given a pipeline run has completed since last view
    When I view the pipeline
    Then the "Run History" tab should show an indicator
