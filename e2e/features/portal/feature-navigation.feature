@portal @navigation
Feature: Feature Navigation

  As a user
  I want to navigate between features
  So that I can access different parts of the system

  Background:
    Given I am logged in as "admin@example.com"
    And I am on the portal page

  # === FEATURE CARDS ===

  @smoke
  Scenario: View feature cards
    Then I should see feature cards for all domains
    And each card should have a title and description

  Scenario: Feature cards show icons
    Then each feature card should have an icon
    And Ingress should have data source icon
    And Transformation should have pipeline icon
    And Reporting should have dashboard icon
    And Export should have download icon
    And Users should have people icon

  # === NAVIGATION TO FEATURES ===

  Scenario: Navigate to Ingress
    When I click on the Ingress feature card
    Then I should be on the ingress page
    And the URL should be the ingress app URL

  Scenario: Navigate to Transformation
    When I click on the Transformation feature card
    Then I should be on the transformation page
    And the URL should be the transformation app URL

  Scenario: Navigate to Reporting
    When I click on the Reporting feature card
    Then I should be on the reporting page
    And the URL should be the reporting app URL

  Scenario: Navigate to Export
    When I click on the Export feature card
    Then I should be on the export page
    And the URL should be the export app URL

  Scenario: Navigate to Users
    When I click on the Users feature card
    Then I should be on the users page
    And the URL should be the users app URL

  # === FEATURE CARD STATES ===

  Scenario: Feature card hover effect
    When I hover over a feature card
    Then it should show a hover effect
    And it should appear clickable

  Scenario: Feature card shows status
    Given the Ingress service is healthy
    Then the Ingress card should show healthy indicator

  Scenario: Feature card shows unhealthy status
    Given the Ingress service is unhealthy
    Then the Ingress card should show unhealthy indicator
    And it should still be clickable

  # === NAVIGATION ACCESSIBILITY ===

  @a11y
  Scenario: Feature cards are keyboard navigable
    When I use Tab to navigate
    Then I should be able to focus each feature card
    And I should be able to activate with Enter

  @a11y
  Scenario: Feature cards have accessible names
    Then each feature card should have an accessible label
    And screen readers should announce the feature name

  # === BACK TO PORTAL ===

  Scenario: Return to portal from Ingress
    Given I am on the ingress page
    When I click the home/portal link
    Then I should return to the portal page

  Scenario: Return to portal from any feature
    Given I am on any feature page
    When I click the home link
    Then I should return to the portal page

  # === NAVIGATION STATE ===

  Scenario: Portal shows which features were visited
    Given I have visited Ingress and Reporting
    When I return to the portal
    Then those features may show a visited indicator

  Scenario: Direct URL navigation
    When I navigate directly to /ingress
    Then I should be on the ingress page

  # === MOBILE NAVIGATION ===

  @mobile
  Scenario: Feature cards responsive on mobile
    Given I am on a mobile device
    Then feature cards should be vertically stacked
    And they should be full width

  @mobile
  Scenario: Touch navigation works
    Given I am on a mobile device
    When I tap on a feature card
    Then I should navigate to that feature

  # === ROLE-BASED VISIBILITY ===

  Scenario: Admin sees all features
    Given I am logged in as "admin@example.com"
    Then I should see all feature cards

  Scenario: Regular user sees accessible features
    Given I am logged in as "user@example.com"
    Then I should see features I have access to
    And restricted features may be hidden or disabled

  # === FEATURE DESCRIPTIONS ===

  Scenario: Ingress card shows description
    Then the Ingress card should describe "Connect and sync data sources"

  Scenario: Transformation card shows description
    Then the Transformation card should describe "Build data pipelines"

  Scenario: Reporting card shows description
    Then the Reporting card should describe "Create dashboards and reports"

  Scenario: Export card shows description
    Then the Export card should describe "Export data in various formats"

  Scenario: Users card shows description
    Then the Users card should describe "Manage users and permissions"

  # === LOADING STATES ===

  @ui
  Scenario: Portal shows loading state initially
    When the portal is loading
    Then I should see loading skeletons for feature cards

  @ui
  Scenario: Navigation shows loading transition
    When I click a feature card
    Then I should see a navigation transition
