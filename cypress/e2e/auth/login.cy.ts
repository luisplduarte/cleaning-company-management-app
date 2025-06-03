describe('Authentication', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should login successfully with valid credentials', () => {
    // Test successful login using custom command with real admin credentials
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in and on dashboard
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
  });

  it('should show error with invalid credentials', () => {
    // Visit login page directly for error test
    cy.visit('/auth/signin');
    
    // Enter non-existent email (this will trigger CredentialsSignin)
    cy.get('input[type="email"]').type('nonexistent@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    
    // Intercept the login request to capture the error
    cy.intercept('POST', '/api/auth/callback/credentials?*').as('failedLogin');
    
    cy.get('button[type="submit"]').click();

    // Wait for the failed login request
    cy.wait('@failedLogin', { timeout: 10000 });
    
    // Verify error state - user should stay on signin page
    cy.url({ timeout: 5000 }).should('include', '/auth/signin');
  });
});
