@export @formats
Feature: Export Job Formats

  As a data engineer
  I want to export data in different formats
  So that I can use the data in various applications

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the export page
    And there is a ReportQuery named "Test Query"

  # === CSV FORMAT ===

  Scenario: Export to CSV format
    When I create an export job with format "csv"
    And the job completes
    Then the output file should have .csv extension

  Scenario: CSV contains headers
    When I export data to CSV
    And I download the file
    Then the first row should contain column headers

  Scenario: CSV uses comma delimiter
    When I export data to CSV
    And I download the file
    Then values should be separated by commas

  Scenario: CSV handles special characters
    Given the data contains commas and quotes
    When I export to CSV
    Then special characters should be properly escaped

  Scenario: CSV handles line breaks in data
    Given the data contains line breaks
    When I export to CSV
    Then line breaks should be properly escaped

  # === JSON FORMAT ===

  Scenario: Export to JSON format
    When I create an export job with format "json"
    And the job completes
    Then the output file should have .json extension

  Scenario: JSON is valid format
    When I export data to JSON
    And I download the file
    Then the file should be valid JSON

  Scenario: JSON contains array of objects
    When I export data to JSON
    And I download the file
    Then the content should be an array of objects

  Scenario: JSON preserves data types
    Given the data contains numbers, strings, and booleans
    When I export to JSON
    Then data types should be preserved

  Scenario: JSON handles nested data
    Given the data contains nested objects
    When I export to JSON
    Then nested structures should be preserved

  Scenario: JSON handles null values
    Given the data contains null values
    When I export to JSON
    Then nulls should be represented as null

  # === XLSX FORMAT ===

  Scenario: Export to XLSX format
    When I create an export job with format "xlsx"
    And the job completes
    Then the output file should have .xlsx extension

  Scenario: XLSX creates valid Excel file
    When I export data to XLSX
    And I download the file
    Then the file should be openable in Excel

  Scenario: XLSX includes headers
    When I export data to XLSX
    Then the first row should contain column headers

  Scenario: XLSX preserves number formatting
    Given the data contains numeric values
    When I export to XLSX
    Then numbers should be formatted as numbers in Excel

  Scenario: XLSX preserves date formatting
    Given the data contains date values
    When I export to XLSX
    Then dates should be formatted as dates in Excel

  Scenario: XLSX handles large datasets
    Given the data contains more than 100,000 rows
    When I export to XLSX
    Then the export should complete successfully
    And all rows should be included

  # === PDF FORMAT ===

  Scenario: Export to PDF format
    When I create an export job with format "pdf"
    And the job completes
    Then the output file should have .pdf extension

  Scenario: PDF is valid document
    When I export data to PDF
    And I download the file
    Then the file should be a valid PDF

  Scenario: PDF includes table formatting
    When I export data to PDF
    Then data should be formatted as a table

  Scenario: PDF includes headers
    When I export data to PDF
    Then the table should include column headers

  Scenario: PDF handles pagination
    Given the data contains many rows
    When I export to PDF
    Then the PDF should have multiple pages

  Scenario: PDF is printable
    When I export data to PDF
    Then the document should be formatted for printing

  # === FORMAT-SPECIFIC OPTIONS ===

  Scenario: CSV format options
    When I configure CSV export
    Then I should see options for delimiter
    And I should see options for quote character

  Scenario: XLSX format options
    When I configure XLSX export
    Then I should see options for sheet name
    And I should see options for column widths

  Scenario: PDF format options
    When I configure PDF export
    Then I should see options for page orientation
    And I should see options for page size

  # === FORMAT COMPARISON ===

  Scenario: Same data exported to different formats
    Given a specific dataset
    When I export to CSV, JSON, and XLSX
    Then all exports should contain the same data
    And record counts should match

  # === FILE SIZE ===

  Scenario: CSV is smallest format
    Given a specific dataset
    When I export to CSV and XLSX
    Then CSV file should be smaller than XLSX

  Scenario: Compressed exports
    Given a large dataset
    When I export to any format
    Then the output may be compressed for large files
