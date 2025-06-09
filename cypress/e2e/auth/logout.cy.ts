// cypress/e2e/auth/logout.cy.ts

describe('Logout Integration', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should logout successfully from dashboard', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in and on dashboard
    cy.url({ timeout: 20000 }).should('include', '/dashboard');
    
    // Verify the logout button is present
    cy.get('[data-testid="logout-button"]').should('be.visible');
    
    // Set up intercept for logout (optional - test passes even if request isn't caught)
    cy.intercept('POST', '/api/auth/signout*').as('signout');
    
    // Click logout button directly
    cy.get('[data-testid="logout-button"]').click();
    
    // Verify we're redirected to sign in page (most reliable check)
    cy.url({ timeout: 15000 }).should('include', '/auth/signin');
    
    // Verify login form is present (confirms we're logged out)
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should logout successfully from any authenticated page', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Navigate to a different authenticated page
    cy.visit('/rates');
    cy.url({ timeout: 10000 }).should('include', '/rates');
    
    // Verify the logout button is present in navbar
    cy.get('button').contains('Sign out').should('be.visible');
    
    // Perform logout
    cy.logout();
    
    // Verify we're redirected to sign in page
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    
    // Verify login form is present
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should prevent access to authenticated pages after logout', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Perform logout
    cy.logout();
    
    // Verify we're on sign in page
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    
    // Try to access authenticated pages directly
    const authenticatedPages = [
      '/dashboard',
      '/rates',
      '/jobs',
      '/clients',
      '/workers',
      '/calendar'
    ];
    
    authenticatedPages.forEach((page) => {
      cy.visit(page);
      // Should be redirected to sign in page
      cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    });
  });

  it('should clear session data after logout', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Perform logout
    cy.logout();
    
    // Verify we're on sign in page
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    
    // Try to access session endpoint - should return null/empty session
    cy.request({
      url: '/api/auth/session',
      failOnStatusCode: false
    }).then((response) => {
      // Session should be null or empty after logout
      expect(response.status).to.be.oneOf([200, 401]);
      if (response.status === 200) {
        expect(response.body).to.be.oneOf([null, {}, { user: null }]);
      }
    });
  });

  it('should handle logout button visibility correctly', () => {
    // When not logged in, logout button should not be visible
    cy.visit('/auth/signin');
    cy.get('button').contains('Sign out').should('not.exist');
    
    // Login
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in and logout button is visible
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    cy.get('button').contains('Sign out').should('be.visible');
    
    // Logout
    cy.logout();
    
    // Verify we're on sign in page and logout button is not visible
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    cy.get('button').contains('Sign out').should('not.exist');
  });

  it('should handle logout from mobile navigation', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Test on mobile viewport
    cy.viewport(375, 667); // iPhone SE size
    
    // The logout button should still be visible on mobile
    cy.get('button').contains('Sign out').should('be.visible');
    
    // Perform logout
    cy.logout();
    
    // Verify we're redirected to sign in page
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    
    // Reset viewport
    cy.viewport(1280, 720);
  });

  it('should handle logout API errors gracefully', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Intercept logout request and simulate error
    cy.intercept('POST', '/api/auth/signout*', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('logoutError');
    
    // Click logout button
    cy.get('button').contains('Sign out').should('be.visible').click();
    
    // Wait for the error response
    cy.wait('@logoutError');
    
    // Even with API error, user should be redirected to signin
    // (NextAuth handles this gracefully on client side)
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
  });

  it('should logout and require fresh login', () => {
    // Login first
    cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    
    // Verify we're logged in
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Perform logout
    cy.logout();
    
    // Verify we're on sign in page
    cy.url({ timeout: 10000 }).should('include', '/auth/signin');
    
    // Try to login again with same credentials
    cy.get('input[type="email"]').clear().type('l.duarte@runtime-revolution.com');
    cy.get('input[type="password"]').clear().type('Runtime0!');
    cy.get('button[type="submit"]').click();
    
    // Should successfully login again
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    
    // Verify we have access to authenticated content
    cy.get('button').contains('Sign out').should('be.visible');
  });
});
