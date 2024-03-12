import { getReferenceTitle } from '../support/app.po';

describe('wizard-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display reference template title', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getReferenceTitle().contains(/Reference Template/);
  });
});
