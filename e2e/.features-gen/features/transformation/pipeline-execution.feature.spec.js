// Generated from: features/transformation/pipeline-execution.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Pipeline Execution', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the transformation page', null, { loginPage, page }); 
  });
  
  test('Run a pipeline successfully', { tag: ['@transformation', '@execution', '@smoke', '@AC-TRN-09'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('there is an active pipeline "Ready Pipeline" with steps'); 
    await When('I select "Ready Pipeline"', null, { page }); 
    await And('I click "Run"', null, { page }); 
    await Then('a new run should appear with status "running"'); 
    await And('the run should eventually complete with status "completed"'); 
    await And('the pipeline lastRunAt should be updated'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/transformation/pipeline-execution.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@transformation","@execution","@smoke","@AC-TRN-09"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the transformation page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"transformation","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"Given there is an active pipeline \"Ready Pipeline\" with steps","stepMatchArguments":[{"group":{"start":28,"value":"\"Ready Pipeline\"","children":[{"start":29,"value":"Ready Pipeline","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I select \"Ready Pipeline\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Ready Pipeline\"","children":[{"start":10,"value":"Ready Pipeline","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I click \"Run\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Run\"","children":[{"start":9,"value":"Run","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then a new run should appear with status \"running\"","stepMatchArguments":[{"group":{"start":36,"value":"\"running\"","children":[{"start":37,"value":"running","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And the run should eventually complete with status \"completed\"","stepMatchArguments":[{"group":{"start":47,"value":"\"completed\"","children":[{"start":48,"value":"completed","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the pipeline lastRunAt should be updated","stepMatchArguments":[]}]},
]; // bdd-data-end