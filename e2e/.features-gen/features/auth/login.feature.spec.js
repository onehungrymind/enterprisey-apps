// Generated from: features/auth/login.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('User Authentication - Login', () => {

  test.beforeEach('Background', async ({ Given, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the login page', null, { loginPage, page }); 
  });
  
  test('Successful login with valid admin credentials', { tag: ['@auth', '@smoke', '@AC-USR-01'] }, async ({ When, Then, And, loginPage, page }) => { 
    await When('I enter email "admin@example.com"', null, { loginPage }); 
    await And('I enter password "password123"', null, { loginPage }); 
    await And('I click the sign in button', null, { loginPage }); 
    await Then('I should be redirected to the dashboard', null, { loginPage }); 
    await And('I should see the user menu', null, { loginPage }); 
    await And('I should see "admin" in the user menu', null, { page }); 
  });

  test('Login page displays correctly', { tag: ['@auth', '@smoke'] }, async ({ Then, And, page }) => { 
    await Then('I should see the email input field', null, { page }); 
    await And('I should see the password input field', null, { page }); 
    await And('I should see the sign in button', null, { page }); 
    await And('the sign in button should be enabled', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/auth/login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":14,"tags":["@auth","@smoke","@AC-USR-01"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the login page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"login","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I enter email \"admin@example.com\"","stepMatchArguments":[{"group":{"start":14,"value":"\"admin@example.com\"","children":[{"start":15,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"And I enter password \"password123\"","stepMatchArguments":[{"group":{"start":17,"value":"\"password123\"","children":[{"start":18,"value":"password123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"And I click the sign in button","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected to the dashboard","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And I should see the user menu","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And I should see \"admin\" in the user menu","stepMatchArguments":[{"group":{"start":13,"value":"\"admin\"","children":[{"start":14,"value":"admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":19,"pickleLine":23,"tags":["@auth","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am on the login page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"login","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then I should see the email input field","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And I should see the password input field","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And I should see the sign in button","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And the sign in button should be enabled","stepMatchArguments":[]}]},
]; // bdd-data-end