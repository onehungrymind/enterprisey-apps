// Generated from: features/transformation/pipelines-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Pipeline CRUD Operations', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the transformation page', null, { loginPage, page }); 
  });
  
  test('View pipelines list', { tag: ['@transformation', '@crud', '@smoke', '@AC-TRN-01'] }, async ({ Then, And, page }) => { 
    await Then('I should see the pipelines list', null, { page }); 
    await And('each pipeline should display its name, status, and step count'); 
    await And('each pipeline should display its source reference'); 
  });

  test('Pipelines list shows status indicators', { tag: ['@transformation', '@crud', '@smoke'] }, async ({ Given, Then, And }) => { 
    await Given('there are pipelines with different statuses'); 
    await Then('draft pipelines should show a draft indicator'); 
    await And('active pipelines should show an active indicator'); 
    await And('error pipelines should show an error indicator'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/transformation/pipelines-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@transformation","@crud","@smoke","@AC-TRN-01"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the transformation page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"transformation","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see the pipelines list","stepMatchArguments":[{"group":{"start":17,"value":"pipelines","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And each pipeline should display its name, status, and step count","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And each pipeline should display its source reference","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":21,"tags":["@transformation","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the transformation page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"transformation","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"Given there are pipelines with different statuses","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then draft pipelines should show a draft indicator","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"And active pipelines should show an active indicator","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And error pipelines should show an error indicator","stepMatchArguments":[]}]},
]; // bdd-data-end