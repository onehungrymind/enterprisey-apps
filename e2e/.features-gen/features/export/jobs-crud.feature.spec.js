// Generated from: features/export/jobs-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Export Job Management', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the export page', null, { loginPage, page }); 
  });
  
  test('View export page layout', { tag: ['@export', '@crud', '@smoke', '@AC-EXP-01'] }, async ({ Then, And }) => { 
    await Then('I should see the export form'); 
    await And('the form should have name field'); 
    await And('the form should have query selection'); 
    await And('the form should have format selection'); 
    await And('I should see the active jobs section'); 
    await And('I should see the job history section'); 
  });

  test('View active jobs section', { tag: ['@export', '@crud', '@smoke'] }, async ({ Given, Then, And }) => { 
    await Given('there are active export jobs'); 
    await Then('I should see the active jobs list'); 
    await And('each job should show name and progress'); 
  });

  test('View job history section', { tag: ['@export', '@crud', '@smoke'] }, async ({ Given, Then, And }) => { 
    await Given('there are completed export jobs'); 
    await Then('I should see the job history list'); 
    await And('each job should show name, status, and completion time'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/export/jobs-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@export","@crud","@smoke","@AC-EXP-01"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the export page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"export","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see the export form","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the form should have name field","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And the form should have query selection","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And the form should have format selection","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And I should see the active jobs section","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And I should see the job history section","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":24,"tags":["@export","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the export page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"export","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Given there are active export jobs","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then I should see the active jobs list","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And each job should show name and progress","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":30,"tags":["@export","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the export page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"export","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":27,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Given there are completed export jobs","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Then I should see the job history list","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And each job should show name, status, and completion time","stepMatchArguments":[]}]},
]; // bdd-data-end