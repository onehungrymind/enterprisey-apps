// Generated from: features/ingress/sources-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Data Source CRUD Operations', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the ingress page', null, { loginPage, page }); 
  });
  
  test('View data sources list', { tag: ['@ingress', '@crud', '@smoke', '@AC-ING-01'] }, async ({ Then, And, page }) => { 
    await Then('I should see the sources list', null, { page }); 
    await And('each source should display its name, type, and status'); 
  });

  test('Sources list shows filter chips', { tag: ['@ingress', '@crud', '@smoke'] }, async ({ Then, And }) => { 
    await Then('I should see filter chips for source types'); 
    await And('I should see filter chips for connection status'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/ingress/sources-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@ingress","@crud","@smoke","@AC-ING-01"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the ingress page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"ingress","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see the sources list","stepMatchArguments":[{"group":{"start":17,"value":"sources","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And each source should display its name, type, and status","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":20,"tags":["@ingress","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the ingress page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"ingress","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then I should see filter chips for source types","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"And I should see filter chips for connection status","stepMatchArguments":[]}]},
]; // bdd-data-end