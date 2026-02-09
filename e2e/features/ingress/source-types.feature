@ingress @source-types
Feature: Data Source Type Configuration

  As a data engineer
  I want different configuration forms for each source type
  So that I can provide the appropriate connection details

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the ingress page

  # === DYNAMIC FORM BY TYPE ===

  @AC-ING-12
  Scenario: Database source shows database-specific fields
    When I click "New Data Source"
    And I select source type "database"
    Then I should see a field for "Host"
    And I should see a field for "Port"
    And I should see a field for "Database"
    And I should see a field for "Username"
    And I should see a field for "Password"

  @AC-ING-12
  Scenario: REST API source shows API-specific fields
    When I click "New Data Source"
    And I select source type "rest_api"
    Then I should see a field for "API URL"
    And I should see a field for "Auth Type"
    And I should see a field for "Auth Token"
    And I should not see a field for "Host"
    And I should not see a field for "Database"

  @AC-ING-12
  Scenario: CSV file source shows file-specific fields
    When I click "New Data Source"
    And I select source type "csv_file"
    Then I should see a field for "File Path"
    And I should see a field for "Delimiter"
    And I should see a field for "Encoding"
    And I should not see a field for "Host"
    And I should not see a field for "Auth Token"

  Scenario: Webhook source shows webhook-specific fields
    When I click "New Data Source"
    And I select source type "webhook"
    Then I should see a generated "Callback URL"
    And I should see a generated "Secret"
    And the callback URL should be read-only
    And I should be able to regenerate the secret

  # === DATABASE TYPE DETAILS ===

  @database
  Scenario: Database type supports multiple database engines
    When I create a database source
    Then I should be able to select "PostgreSQL"
    And I should be able to select "MySQL"
    And I should be able to select "SQLite"
    And I should be able to select "SQL Server"

  @database
  Scenario: Database connection string preview
    When I fill in database connection details
    Then I should see a connection string preview
    And the password should be masked in the preview

  @database
  Scenario: Test database credentials before saving
    When I fill in database connection details
    Then I should see a "Test Before Saving" option

  # === REST API TYPE DETAILS ===

  @rest-api
  Scenario: REST API supports multiple auth types
    When I create a REST API source
    Then I should be able to select auth type "none"
    And I should be able to select auth type "bearer"
    And I should be able to select auth type "basic"
    And I should be able to select auth type "api_key"

  @rest-api
  Scenario: Basic auth shows username and password fields
    When I create a REST API source
    And I select auth type "basic"
    Then I should see a field for "Username"
    And I should see a field for "Password"

  @rest-api
  Scenario: API key auth shows key location options
    When I create a REST API source
    And I select auth type "api_key"
    Then I should see a field for "API Key"
    And I should see options for key location "header" or "query"

  @rest-api
  Scenario: REST API supports custom headers
    When I create a REST API source
    Then I should be able to add custom headers
    And I should be able to add multiple headers

  # === CSV FILE TYPE DETAILS ===

  @csv
  Scenario: CSV source supports different delimiters
    When I create a CSV source
    Then I should be able to select delimiter ","
    And I should be able to select delimiter ";"
    And I should be able to select delimiter "\t"
    And I should be able to enter a custom delimiter

  @csv
  Scenario: CSV source supports different encodings
    When I create a CSV source
    Then I should be able to select encoding "UTF-8"
    And I should be able to select encoding "ISO-8859-1"
    And I should be able to select encoding "Windows-1252"

  @csv
  Scenario: CSV source has header row option
    When I create a CSV source
    Then I should see a checkbox for "First row is header"
    And it should be checked by default

  @csv
  Scenario: CSV file path validation
    When I create a CSV source
    And I enter an invalid file path format
    Then I should see a validation error

  # === WEBHOOK TYPE DETAILS ===

  @webhook
  Scenario: Webhook generates unique callback URL
    When I create a webhook source "Webhook 1"
    And I create another webhook source "Webhook 2"
    Then each webhook should have a unique callback URL

  @webhook
  Scenario: Webhook secret can be regenerated
    Given there is a webhook source "Secure Webhook"
    When I select "Secure Webhook"
    And I click "Regenerate Secret"
    And I confirm the regeneration
    Then the secret should be updated
    And I should see a warning about updating clients

  @webhook
  Scenario: Copy webhook URL to clipboard
    Given there is a webhook source with a callback URL
    When I click the copy button next to the URL
    Then the URL should be copied to clipboard
    And I should see a "Copied" confirmation

  # === TYPE SWITCHING ===

  @edge
  Scenario: Switching type clears previous type fields
    When I click "New Data Source"
    And I select source type "database"
    And I fill in host "localhost"
    And I select source type "rest_api"
    Then the host field should not be visible
    And the API URL field should be empty

  Scenario: Cannot change type of existing source
    Given there is a database source "Locked Type"
    When I select "Locked Type"
    And I click configure
    Then the source type should be read-only
