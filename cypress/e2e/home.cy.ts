describe('Home Page', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
