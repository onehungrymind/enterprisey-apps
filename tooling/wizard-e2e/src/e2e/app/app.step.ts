import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor';
import { checkReferenceTitle } from '../../support/app.po';

Given('I am on the main page of the wizard', () => {
  cy.visit('/');
});

Then('I should see the reference template title', () => {
  checkReferenceTitle();
});
