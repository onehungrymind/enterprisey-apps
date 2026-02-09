// Generated from: features/users/users-crud.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('User Management', () => {

  test.beforeEach('Background', async ({ Given, And, loginPage, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "admin@example.com"', null, { loginPage, page }); 
    await And('I am on the users page', null, { loginPage, page }); 
  });
  
  test('View users list', { tag: ['@users', '@crud', '@smoke'] }, async ({ Then, And, page }) => { 
    await Then('I should see the users list', null, { page }); 
    await And('each user should show name', null, { page }); 
    await And('each user should show email', null, { page }); 
    await And('each user should show role', null, { page }); 
    await And('each user should show company', null, { page }); 
  });

  test('Users list shows role badges', { tag: ['@users', '@crud', '@smoke'] }, async ({ Given, Then, And }) => { 
    await Given('there are users with different roles'); 
    await Then('each user should display a role badge'); 
    await And('admin users should have admin badge'); 
    await And('regular users should have user badge'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/users/users-crud.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":15,"tags":["@users","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the users page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then I should see the users list","stepMatchArguments":[{"group":{"start":17,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And each user should show name","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And each user should show email","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And each user should show role","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And each user should show company","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":23,"tags":["@users","@crud","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"admin@example.com\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"admin@example.com\"","children":[{"start":19,"value":"admin@example.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And I am on the users page","isBg":true,"stepMatchArguments":[{"group":{"start":12,"value":"users","children":[]},"parameterTypeName":"word"}]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Given there are users with different roles","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then each user should display a role badge","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And admin users should have admin badge","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And regular users should have user badge","stepMatchArguments":[]}]},
]; // bdd-data-end