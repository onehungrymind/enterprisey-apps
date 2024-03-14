export const getGreeting = () => cy.get('h1');

const page = {
  title: '[data-test="list-title"]',
  titleLabel: 'Challenges',
};

export const getTitle = () => cy.get(page.title);

export const checkTitle = () => getTitle().contains(page.titleLabel);
