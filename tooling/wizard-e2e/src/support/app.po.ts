
const page = {
  referenceTitle: '[data-test="reference-title"]',
  referenceLabel: 'Reference Template'
}

export const getReferenceTitle = () => cy.get(page.referenceTitle);
export const checkReferenceTitle = () => getReferenceTitle().contains(page.referenceTitle);
