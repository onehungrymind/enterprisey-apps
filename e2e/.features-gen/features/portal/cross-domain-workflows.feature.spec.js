// Generated from: features/portal/cross-domain-workflows.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Cross-Domain Workflows', () => {

  test.beforeEach('Background', async ({ Given, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
  });
  
  test('Complete data pipeline workflow', { tag: ['@portal', '@workflows', '@integration', '@e2e', '@smoke'] }, async ({ Given, When, Then, And, loginPage, page }) => { 
    await Given('I am on the ingress page', null, { loginPage, page }); 
    await When('I create a new database source "Production DB"'); 
    await And('I test the connection successfully'); 
    await And('I sync the source'); 
    await Then('the schema should be discovered'); 
    await When('I navigate to transformation', null, { page }); 
    await And('I create a pipeline "Sales ETL" using "Production DB"'); 
    await And('I add a filter step for active records'); 
    await And('I add a map step to rename fields'); 
    await And('I run the pipeline'); 
    await Then('the pipeline should complete successfully'); 
    await When('I navigate to reporting', null, { page }); 
    await And('I create a query "Sales Summary" from "Sales ETL"'); 
    await And('I create a dashboard "Sales Dashboard"'); 
    await And('I add a bar chart widget using "Sales Summary"'); 
    await Then('the dashboard should display the chart'); 
    await When('I navigate to export', null, { page }); 
    await And('I create an export job for "Sales Summary" as CSV'); 
    await And('the job completes', null, { page }); 
    await Then('I should be able to download the file'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/portal/cross-domain-workflows.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":60,"tags":["@portal","@workflows","@integration","@e2e","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":62,"keywordType":"Context","textWithKeyword":"Given I am on the ingress page","stepMatchArguments":[{"group":{"start":12,"value":"ingress","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"When I create a new database source \"Production DB\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Production DB\"","children":[{"start":32,"value":"Production DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":64,"keywordType":"Action","textWithKeyword":"And I test the connection successfully","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"And I sync the source","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":66,"keywordType":"Outcome","textWithKeyword":"Then the schema should be discovered","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"When I navigate to transformation","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":70,"keywordType":"Action","textWithKeyword":"And I create a pipeline \"Sales ETL\" using \"Production DB\"","stepMatchArguments":[{"group":{"start":20,"value":"\"Sales ETL\"","children":[{"start":21,"value":"Sales ETL","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":38,"value":"\"Production DB\"","children":[{"start":39,"value":"Production DB","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"And I add a filter step for active records","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"And I add a map step to rename fields","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":73,"keywordType":"Action","textWithKeyword":"And I run the pipeline","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"Then the pipeline should complete successfully","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":77,"keywordType":"Action","textWithKeyword":"When I navigate to reporting","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":78,"keywordType":"Action","textWithKeyword":"And I create a query \"Sales Summary\" from \"Sales ETL\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Sales Summary\"","children":[{"start":18,"value":"Sales Summary","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":38,"value":"\"Sales ETL\"","children":[{"start":39,"value":"Sales ETL","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":79,"keywordType":"Action","textWithKeyword":"And I create a dashboard \"Sales Dashboard\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Sales Dashboard\"","children":[{"start":22,"value":"Sales Dashboard","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":80,"keywordType":"Action","textWithKeyword":"And I add a bar chart widget using \"Sales Summary\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Sales Summary\"","children":[{"start":32,"value":"Sales Summary","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":26,"gherkinStepLine":81,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should display the chart","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":84,"keywordType":"Action","textWithKeyword":"When I navigate to export","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":85,"keywordType":"Action","textWithKeyword":"And I create an export job for \"Sales Summary\" as CSV","stepMatchArguments":[{"group":{"start":27,"value":"\"Sales Summary\"","children":[{"start":28,"value":"Sales Summary","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":86,"keywordType":"Action","textWithKeyword":"And the job completes","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":87,"keywordType":"Outcome","textWithKeyword":"Then I should be able to download the file","stepMatchArguments":[]}]},
]; // bdd-data-end