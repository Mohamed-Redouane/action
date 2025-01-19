describe('My First Test', () => {
    it('Visits the Cypress website', () => {
      cy.visit('https://example.cypress.io'); // Visit a sample site
      cy.contains('type').click();          // Click a link
      cy.url().should('include', '/commands/actions'); // Verify the new URL
      cy.get('.action-email').type('test@example.com'); // Type into an input field
    });
  });
  