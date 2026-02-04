Feature: Transformation - Pipeline Management

  Scenario: User can see the pipelines list
    Given I am on the transformation page
    Then I should see the pipelines list

  Scenario: User can create a new pipeline
    Given I am on the transformation page
    When I fill in pipeline name "ETL Pipeline"
    And I fill in pipeline description "Transform customer data"
    And I save the pipeline
    Then I should see "ETL Pipeline" in the pipelines list

  Scenario: User can add a transform step
    Given I am on the transformation page
    And there is an existing pipeline
    When I select the pipeline
    And I add a new step of type "filter"
    Then I should see the step in the step list

  Scenario: User can run a pipeline
    Given I am on the transformation page
    And there is an existing pipeline
    When I click run pipeline
    Then I should see a new entry in the run history
