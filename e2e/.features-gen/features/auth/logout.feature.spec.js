// Generated from: features/auth/logout.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('User Authentication - Logout', () => {

  test.beforeEach('Background', async ({ Given, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
  });
  
  test('User can logout successfully', { tag: ['@auth', '@smoke', '@AC-USR-08'] }, async ({ When, Then, And, page }) => { 
    await When('I click the user menu', null, { page }); 
    await And('I click logout', null, { page }); 
    await Then('I should be redirected to the login page', null, { page }); 
    await And('I should not see the user menu', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/auth/logout.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":14,"tags":["@auth","@smoke","@AC-USR-08"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I click the user menu","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"And I click logout","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected to the login page","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And I should not see the user menu","stepMatchArguments":[]}]},
]; // bdd-data-end