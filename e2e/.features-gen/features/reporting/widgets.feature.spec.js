// Generated from: features/reporting/widgets.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Widget Display and Rendering', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the reporting page', null, { loginPage, page }); 
  });
  
  test('Dashboard displays widget grid', { tag: ['@reporting', '@widgets', '@display', '@smoke'] }, async ({ Given, When, Then, And, apiClient, page }) => { 
    await Given('there is a dashboard named "Analytics Dashboard"', null, { apiClient }); 
    await When('I select "Analytics Dashboard"', null, { page }); 
    await Then('I should see the widget grid'); 
    await And('widgets should be arranged according to their positions'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/reporting/widgets.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@reporting","@widgets","@display","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the reporting page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"reporting","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"Given there is a dashboard named \"Analytics Dashboard\"","stepMatchArguments":[{"group":{"start":11,"value":"dashboard","children":[]},"parameterTypeName":"word"},{"group":{"start":27,"value":"\"Analytics Dashboard\"","children":[{"start":28,"value":"Analytics Dashboard","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I select \"Analytics Dashboard\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Analytics Dashboard\"","children":[{"start":10,"value":"Analytics Dashboard","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then I should see the widget grid","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And widgets should be arranged according to their positions","stepMatchArguments":[]}]},
]; // bdd-data-end