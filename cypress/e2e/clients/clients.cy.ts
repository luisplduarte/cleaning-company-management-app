describe('Client Management', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Client Creation with Admin Access', () => {
    beforeEach(() => {
      // Login as admin to access client management features
      cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    });

    it('should access clients page and navigate to create client', () => {
      // Navigate to clients page
      cy.visit('/clients');
      cy.url({ timeout: 10000 }).should('include', '/clients');
      
      // Wait for page to fully load
      cy.get('main', { timeout: 10000 }).should('be.visible');
      
      // Find and click the "Create Client" button (should be visible for admin)
      cy.get('[data-testid="create-client-button"]', { timeout: 15000 })
        .should('be.visible')
        .click();
      
      // Wait a bit for navigation
      cy.wait(1000);
      
      // Verify we're on the new client page
      cy.url({ timeout: 15000 }).should('include', '/clients/new');
    });

    it('should create a new client successfully with valid data', () => {
      // Navigate directly to the new client page
      cy.visit('/clients/new');
      
      // Verify we're on the new client page
      cy.url({ timeout: 10000 }).should('include', '/clients/new');
      
      // Wait for the form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Fill out the client form with valid data
      const testClient = {
        name: 'Test Client Company',
        email: 'test@testclient.com',
        phone: '+1234567890',
        country: 'United States',
        town: 'New York',
        zipCode: '10001'
      };
      
      // Fill form fields
      cy.get('input[name="name"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.name);
      cy.get('input[name="email"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.email);
      cy.get('input[name="phone"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.phone);
      cy.get('input[name="country"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.country);
      cy.get('input[name="town"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.town);
      cy.get('input[name="zipCode"]', { timeout: 5000 }).should('be.visible').clear().type(testClient.zipCode);
      
      // Intercept the API call
      cy.intercept('POST', '/api/clients').as('createClient');
      
      // Submit the form
      cy.contains('Create Client', { timeout: 5000 }).should('be.visible').click();
      
      // Wait for API call to complete
      cy.wait('@createClient', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      });
      
      // Verify success - should redirect back to clients list
      cy.url({ timeout: 10000 }).should('include', '/clients');
      cy.url().should('not.include', '/new');
    });

    it('should show validation errors for empty required fields', () => {
      // Navigate to new client page
      cy.visit('/clients/new');
      
      // Wait for form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Try to submit empty form
      cy.contains('Create Client').click();
      
      // Verify validation errors appear
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text();
        return text.includes('required') || 
               text.includes('invalid') || 
               text.includes('error') ||
               text.includes('Please') ||
               text.includes('must');
      });
    });

    it('should handle API errors gracefully', () => {
      // Navigate to new client page
      cy.visit('/clients/new');
      
      // Fill form with valid data
      cy.get('input[name="name"]').type('Test Client');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="phone"]').type('+1234567890');
      cy.get('input[name="country"]').type('United States');
      cy.get('input[name="town"]').type('New York');
      cy.get('input[name="zipCode"]').type('10001');
      
      // Intercept API call and force error
      cy.intercept('POST', '/api/clients', { 
        statusCode: 500, 
        body: { error: 'Internal Server Error' }
      }).as('createClientError');
      
      // Submit form
      cy.contains('Create Client').click();
      
      // Wait for API call
      cy.wait('@createClientError', { timeout: 10000 });
      
      // Verify error handling - should stay on form page
      cy.url().should('include', '/clients/new');
    });

    it('should allow canceling client creation', () => {
      // Navigate to new client page
      cy.visit('/clients/new');
      
      // Look for cancel button and click it
      cy.contains('Cancel').click();
      
      // Verify we're back to clients list
      cy.url({ timeout: 10000 }).should('include', '/clients');
      cy.url().should('not.include', '/new');
    });
  });
});
