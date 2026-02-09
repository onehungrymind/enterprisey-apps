// Generated from: features/ingress/connection-testing.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Data Source Connection Testing', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the ingress page', null, { loginPage, page }); 
  });
  
  test('Test connection succeeds for valid database', { tag: ['@ingress', '@connection', '@smoke', '@AC-ING-05'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('there is a database source "Valid DB" with correct credentials'); 
    await When('I select "Valid DB"', null, { page }); 
    await And('I click "Test Connection"', null, { page }); 
    await Then('the status should change to "testing"', null, { page }); 
    await And('I should see a loading indicator', null, { page }); 
    await And('within 10 seconds the status should be "connected"', null, { page }); 
    await And('I should see a success message'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/ingress/connection-testing.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@ingress","@connection","@smoke","@AC-ING-05"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the ingress page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"ingress","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"Given there is a database source \"Valid DB\" with correct credentials","stepMatchArguments":[{"group":{"start":27,"value":"\"Valid DB\"","children":[{"start":28,"value":"Valid DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I select \"Valid DB\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Valid DB\"","children":[{"start":10,"value":"Valid DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I click \"Test Connection\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Test Connection\"","children":[{"start":9,"value":"Test Connection","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the status should change to \"testing\"","stepMatchArguments":[{"group":{"start":28,"value":"\"testing\"","children":[{"start":29,"value":"testing","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And I should see a loading indicator","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And within 10 seconds the status should be \"connected\"","stepMatchArguments":[{"group":{"start":7,"value":"10","children":[]},"parameterTypeName":"int"},{"group":{"start":39,"value":"\"connected\"","children":[{"start":40,"value":"connected","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And I should see a success message","stepMatchArguments":[]}]},
]; // bdd-data-end