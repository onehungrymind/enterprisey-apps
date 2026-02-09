// Generated from: features/users/companies-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('Company Management', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the users page', null, { loginPage, page }); 
    await And('I am on the companies tab', null, { page }); 
  });
  
  test('View companies list', { tag: ['@users', '@companies', '@crud', '@smoke'] }, async ({ Then, And, page }) => { 
    await Then('I should see the companies list', null, { page }); 
    await And('each company should show name'); 
    await And('each company should show description'); 
    await And('each company should show user count'); 
  });

  test('Companies tab accessible', { tag: ['@users', '@companies', '@crud', '@smoke'] }, async ({ Given, When, Then, loginPage, page }) => { 
    await Given('I am on the users page', null, { loginPage, page }); 
    await When('I click "Companies"', null, { page }); 
    await Then('I should see the companies tab content'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/users/companies-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":16,"tags":["@users","@companies","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the users page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"And I am on the companies tab","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then I should see the companies list","stepMatchArguments":[{"group":{"start":17,"value":"companies","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And each company should show name","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And each company should show description","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And each company should show user count","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":23,"tags":["@users","@companies","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the users page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":9,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"And I am on the companies tab","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given I am on the users page","stepMatchArguments":[{"group":{"start":12,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I click \"Companies\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Companies\"","children":[{"start":9,"value":"Companies","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then I should see the companies tab content","stepMatchArguments":[]}]},
]; // bdd-data-end