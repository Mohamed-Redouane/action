describe('Signup Page', () => {
    beforeEach(() => {
      cy.visit('/signup'); 
    });
  
    it('should display the signup form', () => {
      cy.contains('Create an Account').should('be.visible');
      cy.get('input#name').should('exist');
      cy.get('input#email').should('exist');
      cy.get('input#password').should('exist');
      cy.get('button[type="submit"]').contains('Sign Up');
    });
  
    it('should show validation errors for empty fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Please enter your name').should('be.visible');
      cy.contains('Please enter your email').should('be.visible');
      cy.contains('Please enter your password').should('be.visible');
    });
  
    it('should allow typing into input fields', () => {
      cy.get('input#name').type('John Doe').should('have.value', 'John Doe');
      cy.get('input#email')
        .type('john.doe@example.com')
        .should('have.value', 'john.doe@example.com');
      cy.get('input#password')
        .type('securepassword123')
        .should('have.value', 'securepassword123');
    });
  });
  