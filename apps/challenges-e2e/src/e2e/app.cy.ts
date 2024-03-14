import { checkTitle } from '../support/app.po';

describe('challenges-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display list title', () => {
    checkTitle();
  });
});
