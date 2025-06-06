describe('Job Management', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Job Creation with Admin Access', () => {
    beforeEach(() => {
      // Login as admin to access job management features
      cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    });

    it('should access jobs page and navigate to create job', () => {
      // Navigate to jobs page
      cy.visit('/jobs');
      cy.url({ timeout: 20000 }).should('include', '/jobs');
      
      // Wait for page to fully load
      cy.get('main', { timeout: 20000 }).should('be.visible');
      
      // Find and click the "Create Job" button (should be visible for admin)
      cy.get('[data-testid="create-job-button"]', { timeout: 20000 })
        .should('be.visible')
        .click();
      
      // Wait a bit for navigation
      cy.wait(1000);
      
      // Verify we're on the new job page
      cy.url({ timeout: 20000 }).should('include', '/jobs/new');
    });

    it('should create a new job successfully with valid data', () => {
      // Navigate directly to the new job page
      cy.visit('/jobs/new');
      
      // Verify we're on the new job page
      cy.url({ timeout: 20000 }).should('include', '/jobs/new');
      
      // Wait for the form to load
      cy.get('form', { timeout: 20000 }).should('be.visible');
      
      // Wait for the form fields to be available
      cy.get('input[name="title"]', { timeout: 20000 }).should('be.visible');
      
      // Fill out the job form with valid data
      const testJob = {
        title: 'Test Job Title',
        description: 'This is a test job description.',
        location: 'Remote',
      };
      
      // Fill form fields
      cy.get('input[name="title"]').clear().type(testJob.title);
      cy.get('textarea[name="description"]').clear().type(testJob.description);
      cy.get('input[name="location"]').clear().type(testJob.location);
      
      // Fill start date
      cy.get('input[name="start_date"]').type('2024-12-20T09:00');
      
      // Fill end date  
      cy.get('input[name="end_date"]').type('2024-12-20T17:00');
      
      // Wait for clients and workers to load, then select them
      cy.get('select[name="clientId"]', { timeout: 20000 }).should('be.visible').and('not.be.disabled');
      cy.get('select[name="clientId"] option', { timeout: 20000 }).should('have.length.greaterThan', 0);
      cy.get('select[name="clientId"]').select('cmbkokel20000adux2nm2t8i6');
      
      cy.get('select[name="workerId"]', { timeout: 20000 }).should('be.visible').and('not.be.disabled');
      cy.get('select[name="workerId"] option', { timeout: 20000 }).should('have.length.greaterThan', 0);
      cy.get('select[name="workerId"]').select('cmbkom3b80001aduxl5jo8wfg');
      
      // Intercept the API call
      cy.intercept('POST', '/api/jobs').as('createJob');
      
      // Submit the form
      cy.get('button[type="submit"]', { timeout: 20000 }).should('be.visible').and('not.be.disabled').click();
      
      // Wait for API call to complete
      cy.wait('@createJob', { timeout: 20000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      });
      
      // Verify success - should redirect back to jobs list
      cy.url({ timeout: 20000 }).should('include', '/jobs');
      cy.url().should('not.include', '/new');
    });

    it('should show validation errors for empty required fields', () => {
      // Navigate to new job page
      cy.visit('/jobs/new');
      
      // Wait for form to load
      cy.get('form', { timeout: 20000 }).should('be.visible');
      
      // Wait for Save button to be visible
      cy.contains('Save', { timeout: 20000 }).should('be.visible');
      // Try to submit empty form
      cy.contains('Save').click();
      
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
      // Navigate to new job page
      cy.visit('/jobs/new');
      
      // Fill form with valid data
      cy.get('input[name="title"]').type('Test Job');
      cy.get('textarea[name="description"]').type('This is a test job description.');
      cy.get('input[name="location"]').type('Remote');
      
      // Intercept API call and force error
      cy.intercept('POST', '/api/jobs', { 
        statusCode: 500, 
        body: { error: 'Internal Server Error' }
      }).as('createJobError');
      
      // Submit form
      cy.contains('Save').click();
      
      // Wait for API call
      cy.wait('@createJobError', { timeout: 20000 });
      
      // Verify error handling - should stay on form page
      cy.url().should('include', '/jobs/new');
    });

    it('should allow canceling job creation', () => {
      // Navigate to new job page
      cy.visit('/jobs/new');
      
      // Wait for Cancel button to be visible
      cy.contains('Cancel', { timeout: 20000 }).should('be.visible');
      // Look for cancel button and click it
      cy.contains('Cancel').click();
      
      // Verify we're back to jobs list
      cy.url({ timeout: 20000 }).should('include', '/jobs');
      cy.url().should('not.include', '/new');
    });
  });
});
