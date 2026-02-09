@auth @api
Feature: Token Validation

  As the system
  I want to validate JWT tokens
  So that only authenticated users can access protected resources

  # === TOKEN VALIDATION ===

  @AC-USR-03
  Scenario: Valid token is accepted
    Given a user has a valid JWT token
    When the token is sent to the validate endpoint
    Then the response should contain the user object without password
    And the HTTP status should be 200

  @AC-USR-04
  Scenario: Expired token is rejected
    Given a user has an expired JWT token
    When the token is sent to the validate endpoint
    Then the response should be 401 Unauthorized

  @AC-USR-04
  Scenario: Malformed token is rejected
    Given a user has a malformed JWT token
    When the token is sent to the validate endpoint
    Then the response should be 401 Unauthorized

  @AC-USR-04
  Scenario: Token with invalid signature is rejected
    Given a user has a JWT token with invalid signature
    When the token is sent to the validate endpoint
    Then the response should be 401 Unauthorized

  Scenario: Missing token is rejected
    When a request is made without a token
    Then the response should be 401 Unauthorized

  Scenario: Token for deleted user is rejected
    Given a user has a valid JWT token
    And the user's account has been deleted
    When the token is sent to the validate endpoint
    Then the response should be 401 Unauthorized

  # === CROSS-DOMAIN TOKEN VALIDATION ===

  @AC-USR-06
  Scenario: Token is validated across all backend services
    Given a user is authenticated with a valid token
    When the user accesses the Ingress API
    Then the token should be validated via the Users API
    When the user accesses the Transformation API
    Then the token should be validated via the Users API
    When the user accesses the Reporting API
    Then the token should be validated via the Users API
    When the user accesses the Export API
    Then the token should be validated via the Users API
