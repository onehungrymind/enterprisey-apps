// Generated from: features/portal/feature-navigation.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Feature Navigation', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the portal page', null, { loginPage, page }); 
  });
  
  test('View feature cards', { tag: ['@portal', '@navigation', '@smoke'] }, async ({ Then, And }) => { 
    await Then('I should see feature cards for all domains'); 
    await And('each card should have a title and description'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/portal/feature-navigation.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@portal","@navigation","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the portal page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"portal","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see feature cards for all domains","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And each card should have a title and description","stepMatchArguments":[]}]},
]; // bdd-data-end