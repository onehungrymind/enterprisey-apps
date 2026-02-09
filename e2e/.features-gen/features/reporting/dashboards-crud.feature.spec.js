// Generated from: features/reporting/dashboards-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Dashboard CRUD Operations', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the reporting page', null, { loginPage, page }); 
  });
  
  test('View dashboards list', { tag: ['@reporting', '@crud', '@smoke', '@AC-RPT-01'] }, async ({ Then, And, page }) => { 
    await Then('I should see the dashboards list', null, { page }); 
    await And('each dashboard should display its name'); 
    await And('each dashboard should display its description'); 
    await And('each dashboard should display widget count'); 
    await And('each dashboard should display public/private status'); 
  });

  test('Dashboards list shows creator information', { tag: ['@reporting', '@crud', '@smoke'] }, async ({ Given, Then }) => { 
    await Given('there are dashboards created by different users'); 
    await Then('each dashboard should show "Created by" information'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/reporting/dashboards-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@reporting","@crud","@smoke","@AC-RPT-01"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the reporting page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"reporting","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see the dashboards list","stepMatchArguments":[{"group":{"start":17,"value":"dashboards","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And each dashboard should display its name","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And each dashboard should display its description","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And each dashboard should display widget count","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And each dashboard should display public/private status","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":23,"tags":["@reporting","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the reporting page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"reporting","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given there are dashboards created by different users","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then each dashboard should show \"Created by\" information","stepMatchArguments":[{"group":{"start":27,"value":"\"Created by\"","children":[{"start":28,"value":"Created by","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end