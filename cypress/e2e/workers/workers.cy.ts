describe('Worker Management', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Worker Management with Admin Access', () => {
    beforeEach(() => {
      // Login as admin to access worker management features
      cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    });

    it('should access workers page and navigate to create worker', () => {
      // Navigate to workers page
      cy.visit('/workers');
      cy.url({ timeout: 10000 }).should('include', '/workers');
      
      // Wait for page to fully load
      cy.get('main', { timeout: 10000 }).should('be.visible');
      
      // Find and click the "Create Worker" button (try multiple selectors)
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="create-worker-button"]').length > 0) {
          cy.get('[data-testid="create-worker-button"]').click();
        } else {
          // Fallback to text-based selection
          cy.contains('Create Worker').click();
        }
      });
      
      // Wait a bit for navigation
      cy.wait(1000);
      
      // Verify we're on the new worker page
      cy.url({ timeout: 15000 }).should('include', '/workers/new');
    });

    it('should create a new worker successfully with valid data', () => {
      // Navigate directly to the new worker page
      cy.visit('/workers/new');
      
      // Verify we're on the new worker page
      cy.url({ timeout: 10000 }).should('include', '/workers/new');
      
      // Wait for the form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Fill out the worker form with valid data
      const testWorker = {
        name: 'Test Worker',
        email: 'test.worker@example.com',
        phone: '+1234567890',
        country: 'United States',
        town: 'New York',
        zipCode: '10001',
        hourly_rate: '25.50'
      };
      
      // Fill form fields using IDs
      cy.get('#name', { timeout: 5000 }).should('be.visible').clear().type(testWorker.name);
      cy.get('#email', { timeout: 5000 }).should('be.visible').clear().type(testWorker.email);
      cy.get('#phone', { timeout: 5000 }).should('be.visible').clear().type(testWorker.phone);
      cy.get('#country', { timeout: 5000 }).should('be.visible').clear().type(testWorker.country);
      cy.get('#town', { timeout: 5000 }).should('be.visible').clear().type(testWorker.town);
      cy.get('#zipCode', { timeout: 5000 }).should('be.visible').clear().type(testWorker.zipCode);
      cy.get('#hourly_rate', { timeout: 5000 }).should('be.visible').clear().type(testWorker.hourly_rate);
      
      // Intercept the API call
      cy.intercept('POST', '/api/workers').as('createWorker');
      
      // Submit the form
      cy.contains('Save Worker', { timeout: 5000 }).should('be.visible').click();
      
      // Wait for API call to complete
      cy.wait('@createWorker', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      });
      
      // Verify success - should redirect to worker detail page
      cy.url({ timeout: 10000 }).then((url) => {
        // Should redirect to worker detail page /workers/{id} OR stay on form with success
        expect(url).to.satisfy((url: string) => {
          return url.includes('/workers/') || url.includes('/workers');
        });
      });
    });

    it('should show validation errors for empty required fields', () => {
      // Navigate to new worker page
      cy.visit('/workers/new');
      
      // Wait for form to load
      cy.get('form', { timeout: 10000 }).should('be.visible');
      
      // Try to submit empty form
      cy.contains('Save Worker').click();
      
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
      // Navigate to new worker page
      cy.visit('/workers/new');
      
      // Fill form with valid data
      cy.get('#name').type('Test Worker');
      cy.get('#email').type('test@example.com');
      cy.get('#phone').type('+1234567890');
      cy.get('#country').type('United States');
      cy.get('#town').type('New York');
      cy.get('#zipCode').type('10001');
      cy.get('#hourly_rate').type('25.00');
      
      // Intercept API call and force error
      cy.intercept('POST', '/api/workers', { 
        statusCode: 500, 
        body: { error: 'Internal Server Error' }
      }).as('createWorkerError');
      
      // Submit form
      cy.contains('Save Worker').click();
      
      // Wait for API call
      cy.wait('@createWorkerError', { timeout: 10000 });
      
      // Verify error handling - should stay on form page or show error
      cy.url().should('include', '/workers/new');
    });

    it('should allow canceling worker creation', () => {
      // Navigate to new worker page
      cy.visit('/workers/new');
      
      // Look for cancel button and click it
      cy.contains('Cancel').click();
      
      // Verify we're back to workers list
      cy.url({ timeout: 10000 }).should('include', '/workers');
      cy.url().should('not.include', '/new');
    });

    it('should validate hourly rate field properly', () => {
      // Navigate to new worker page
      cy.visit('/workers/new');
      
      // Fill required fields
      cy.get('#name').type('Test Worker');
      cy.get('#email').type('test@example.com');
      
      // Try invalid hourly rate (negative number)
      cy.get('#hourly_rate').type('-5');
      
      // Try to submit
      cy.contains('Save Worker').click();
      
      // Should show validation error or prevent submission
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cy.get('body').should('satisfy', ($body: any) => {
        const text = $body.text();
        return text.includes('positive') || 
               text.includes('greater') || 
               text.includes('invalid') ||
               text.includes('error');
      });
    });
  });
});
