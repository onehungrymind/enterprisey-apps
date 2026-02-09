// Generated from: features/ingress/sync-operations.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Data Source Sync Operations', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the ingress page', null, { loginPage, page }); 
  });
  
  test('Sync connected source successfully', { tag: ['@ingress', '@sync', '@smoke', '@AC-ING-08'] }, async ({ Given, When, Then, And, apiClient, page }) => { 
    await Given('there is a connected source "Production DB"', null, { apiClient }); 
    await When('I select "Production DB"', null, { page }); 
    await And('I click "Sync Now"', null, { page }); 
    await Then('the status should change to "syncing"', null, { page }); 
    await And('I should see a sync progress indicator'); 
    await And('within 30 seconds the status should be "connected"', null, { page }); 
    await And('the "Last Synced" timestamp should be updated', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/ingress/sync-operations.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@ingress","@sync","@smoke","@AC-ING-08"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the ingress page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"ingress","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"Given there is a connected source \"Production DB\"","stepMatchArguments":[{"group":{"start":28,"value":"\"Production DB\"","children":[{"start":29,"value":"Production DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I select \"Production DB\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Production DB\"","children":[{"start":10,"value":"Production DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I click \"Sync Now\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Sync Now\"","children":[{"start":9,"value":"Sync Now","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then the status should change to \"syncing\"","stepMatchArguments":[{"group":{"start":28,"value":"\"syncing\"","children":[{"start":29,"value":"syncing","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And I should see a sync progress indicator","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And within 30 seconds the status should be \"connected\"","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":39,"value":"\"connected\"","children":[{"start":40,"value":"connected","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And the \"Last Synced\" timestamp should be updated","stepMatchArguments":[{"group":{"start":4,"value":"\"Last Synced\"","children":[{"start":5,"value":"Last Synced","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end