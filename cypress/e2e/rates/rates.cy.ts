describe('Rate Management', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Rate Management with Admin Access', () => {
    beforeEach(() => {
      // Login as admin to access rate management features
      cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    });

    it('should access rates page and navigate to create rate', () => {
      // Navigate to rates page
      cy.visit('/rates');
      cy.url({ timeout: 10000 }).should('include', '/rates');
      
      // Wait for page to fully load
      cy.get('main', { timeout: 10000 }).should('be.visible');
      
      // Find and click the "New Rate" button
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="new-rate-button"]').length > 0) {
          cy.get('[data-testid="new-rate-button"]').click();
        } else {
          // Fallback to text-based selection
          cy.contains('New Rate').click();
        }
      });
      
      // Wait a bit for navigation
      cy.wait(1000);
      
      // Verify we're on the new rate page
      cy.url({ timeout: 15000 }).should('include', '/rates/new');
    });

    it('should create a new rate successfully with valid data', () => {
      // Navigate directly to the new rate page
      cy.visit('/rates/new');
      
      // Verify we're on the new rate page
      cy.url({ timeout: 10000 }).should('include', '/rates/new');
      
      // Wait for the form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Fill out the rate form with valid data - use timestamp to ensure uniqueness
      const timestamp = Date.now();
      const testRate = {
        name: `Test Profit Margin ${timestamp}`,
        description: 'Test rate for profit margin calculation',
        value: '15.5'
      };
      
      // Fill form fields using IDs
      cy.get('#name', { timeout: 5000 }).should('be.visible').clear().type(testRate.name);
      cy.get('#description', { timeout: 5000 }).should('be.visible').clear().type(testRate.description);
      cy.get('#value', { timeout: 5000 }).should('be.visible').clear().type(testRate.value);
      
      // Intercept the API call
      cy.intercept('POST', '/api/rates').as('createRate');
      
      // Submit the form
      cy.contains('Save Rate', { timeout: 5000 }).should('be.visible').click();
      
      // Wait for API call to complete
      cy.wait('@createRate', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      });
      
      // Wait for redirect to complete
      cy.url({ timeout: 15000 }).should('include', '/rates');
      cy.url().should('not.include', '/new');
    });

    it('should show validation errors for empty required fields', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Wait for form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Try to submit empty form
      cy.contains('Save Rate').click();
      
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

    it('should validate value field for proper percentage format', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Fill required fields with unique name
      const timestamp = Date.now();
      cy.get('#name').type(`Test Rate ${timestamp}`);
      cy.get('#description').type('Test Description');
      
      // Try invalid value (over 100%)
      cy.get('#value').type('150');
      
      // Try to submit
      cy.contains('Save Rate').click();
      
      // Should show validation error or prevent submission
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text();
        return text.includes('100') || 
               text.includes('exceed') || 
               text.includes('invalid') ||
               text.includes('error');
      });
    });

    it('should validate value field for negative numbers', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Fill required fields with unique name
      const timestamp = Date.now();
      cy.get('#name').type(`Test Rate ${timestamp}`);
      cy.get('#description').type('Test Description');
      
      // Try negative value
      cy.get('#value').type('-5');
      
      // Try to submit
      cy.contains('Save Rate').click();
      
      // Should show validation error or prevent submission
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text();
        return text.includes('positive') || 
               text.includes('greater') || 
               text.includes('invalid') ||
               text.includes('error');
      });
    });

    it('should handle API errors gracefully', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Fill form with valid data
      const timestamp = Date.now();
      cy.get('#name').type(`Test Rate ${timestamp}`);
      cy.get('#description').type('Test Description');
      cy.get('#value').type('25.0');
      
      // Intercept API call and force error
      cy.intercept('POST', '/api/rates', { 
        statusCode: 500, 
        body: { error: 'Internal Server Error' }
      }).as('createRateError');
      
      // Submit form
      cy.contains('Save Rate').click();
      
      // Wait for API call
      cy.wait('@createRateError', { timeout: 10000 });
      
      // Verify error handling - should stay on form page or show error
      cy.url().should('include', '/rates/new');
    });

    it('should allow canceling rate creation', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Look for cancel button and click it
      cy.contains('Cancel').click();
      
      // Verify we're back to rates list
      cy.url({ timeout: 10000 }).should('include', '/rates');
      cy.url().should('not.include', '/new');
    });

    it('should validate decimal places in value field', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Fill required fields with unique name
      const timestamp = Date.now();
      cy.get('#name').type(`Test Rate ${timestamp}`);
      cy.get('#description').type('Test Description');
      
      // Try value with valid decimal places
      cy.get('#value').clear().type('25.75');
      
      // Intercept the API call
      cy.intercept('POST', '/api/rates').as('createRate');
      
      // Submit form
      cy.contains('Save Rate').click();
      
      // Wait for API call to complete successfully
      cy.wait('@createRate', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      });
      
      // Wait for redirect to complete
      cy.url({ timeout: 15000 }).should('include', '/rates');
      cy.url().should('not.include', '/new');
    });

    it('should handle form submission with loading state', () => {
      // Navigate to new rate page
      cy.visit('/rates/new');
      
      // Fill form with valid data
      const timestamp = Date.now();
      cy.get('#name').type(`Test Rate ${timestamp}`);
      cy.get('#description').type('Test Description');
      cy.get('#value').type('20.0');
      
      // Intercept API call with delay to test loading state
      cy.intercept('POST', '/api/rates', {
        delay: 1000,
        statusCode: 201,
        body: { id: '1', name: `Test Rate ${timestamp}`, description: 'Test Description', value: 20.0 }
      }).as('createRateWithDelay');
      
      // Submit form
      cy.contains('Save Rate').click();
      
      // Verify loading state (button should show loading text or be disabled)
      cy.contains('Saving...', { timeout: 2000 }).should('be.visible');
      
      // Wait for API call to complete
      cy.wait('@createRateWithDelay', { timeout: 15000 });
      
      // Should redirect after completion
      cy.url({ timeout: 15000 }).should('include', '/rates');
      cy.url().should('not.include', '/new');
    });
  });
});
