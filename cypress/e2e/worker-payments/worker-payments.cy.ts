describe('Worker Payments Management', () => {
  beforeEach(() => {
    // Clear stored sessions before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Worker Payments Access and Management with Admin Access', () => {
    beforeEach(() => {
      // Login as admin to access worker payments management features
      cy.login('l.duarte@runtime-revolution.com', 'Runtime0!');
    });

    it('should access worker payments page and display payments table', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      cy.url({ timeout: 10000 }).should('include', '/worker-payments');
      
      // Wait for page to fully load
      cy.get('div', { timeout: 10000 }).should('be.visible');
      
      // Verify page header is present
      cy.contains('Worker Payments', { timeout: 15000 }).should('be.visible');
      
      // Verify description is present
      cy.contains('Track and manage worker payment records. The status can be updated to reflect the current state of each payment.', { timeout: 10000 }).should('be.visible');
      
      // Check if payments table is present
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Verify table headers are present
      cy.get('thead').within(() => {
        cy.contains('Worker').should('be.visible');
        cy.contains('Job').should('be.visible');
        cy.contains('Amount').should('be.visible');
        cy.contains('Payment Date').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Actions').should('be.visible');
      });
    });

    it('should load and display worker payments data from API', () => {
      // Intercept the API call to check data loading
      cy.intercept('GET', '/api/worker-payments').as('getWorkerPayments');
      
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for API call to complete
      cy.wait('@getWorkerPayments', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
      });
      
      // Verify table body is present (whether empty or with data)
      cy.get('tbody', { timeout: 10000 }).should('be.visible');
    });

    it('should display edit button for payment status updates', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for table to load
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Check if there are any payments and if edit buttons are present
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length > 0) {
          // If there are payments, check for edit buttons
          cy.get('tbody tr').first().within(() => {
            cy.get('button').should('contain.html', 'svg'); // Edit icon button
          });
        } else {
          cy.log('No payments found - this is acceptable for testing');
        }
      });
    });

    it('should handle payment status editing workflow', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for table to load
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Check if there are payments to edit
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length > 0) {
          // Click edit button on first payment
          cy.get('tbody tr').first().within(() => {
            cy.get('button').first().click();
          });
          
          // Verify status dropdown appears
          cy.get('select').should('be.visible');
          
          // Verify dropdown has the expected options
          cy.get('select option').should('contain', 'Waiting payment');
          cy.get('select option').should('contain', 'Issued');
          cy.get('select option').should('contain', 'Completed');
          
          // Check for save and cancel buttons
          cy.get('button').should('contain.html', 'svg'); // Check/Save button
          cy.get('button').should('contain.html', 'svg'); // X/Cancel button
          
          // Click cancel to exit edit mode
          cy.get('tbody tr').first().within(() => {
            cy.get('button').last().click(); // Cancel button (X icon)
          });
          
          // Verify we're back to view mode
          cy.get('select').should('not.exist');
        } else {
          cy.log('No payments found - skipping edit workflow test');
        }
      });
    });

    it('should successfully update payment status via API', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for table to load
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Check if there are payments to update
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length > 0) {
          // Get the first payment ID for API interception
          cy.get('tbody tr').first().within(() => {
            // Click edit button
            cy.get('button').first().click();
            
            // Change status in dropdown
            cy.get('select').select('ISSUED');
          });
          
          // Intercept the API call for status update
          cy.intercept('PATCH', '/api/worker-payments/*').as('updatePaymentStatus');
          
          // Click save button
          cy.get('tbody tr').first().within(() => {
            cy.get('button').first().click(); // Save button (Check icon)
          });
          
          // Wait for API call to complete
          cy.wait('@updatePaymentStatus', { timeout: 15000 }).then((interception) => {
            expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
          });
          
          // Verify we're back to view mode
          cy.get('select').should('not.exist');
        } else {
          cy.log('No payments found - skipping API update test');
        }
      });
    });

    it('should handle API errors gracefully during status update', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for table to load
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Check if there are payments to test error handling
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length > 0) {
          // Intercept API call and force error
          cy.intercept('PATCH', '/api/worker-payments/*', { 
            statusCode: 500, 
            body: { error: 'Internal Server Error' }
          }).as('updatePaymentError');
          
          cy.get('tbody tr').first().within(() => {
            // Click edit button
            cy.get('button').first().click();
            
            // Change status
            cy.get('select').select('COMPLETED');
            
            // Click save button
            cy.get('button').first().click();
          });
          
          // Wait for API call
          cy.wait('@updatePaymentError', { timeout: 10000 });
          
          // Verify error handling - should remain in edit mode or show error
          cy.log('API error handled - checking application remains functional');
          
          // Verify page doesn't crash
          cy.get('table').should('be.visible');
        } else {
          cy.log('No payments found - skipping error handling test');
        }
      });
    });

    it('should display proper loading states', () => {
      // Intercept API call with delay to test loading state
      cy.intercept('GET', '/api/worker-payments', { 
        delay: 1000,
        body: []
      }).as('getWorkerPaymentsWithDelay');
      
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Check for loading indicator
      cy.contains('Loading', { timeout: 5000 }).should('be.visible');
      
      // Wait for API call to complete
      cy.wait('@getWorkerPaymentsWithDelay', { timeout: 15000 });
      
      // Verify loading is gone and table is visible
      cy.get('table', { timeout: 10000 }).should('be.visible');
    });

    it('should have proper table structure and formatting', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Wait for table to load
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // Verify table has proper structure
      cy.get('table').should('have.class', 'min-w-full');
      cy.get('thead').should('have.class', 'bg-gray-50');
      cy.get('tbody').should('have.class', 'bg-white');
      
      // Check if there are payments and verify formatting
      cy.get('tbody tr').then(($rows) => {
        if ($rows.length > 0) {
          cy.get('tbody tr').first().within(() => {
            // Check that amount is formatted with $ and decimal places
            cy.get('td').eq(2).should('contain', '$');
            
            // Check that status is properly formatted
            cy.get('td').eq(4).should('not.be.empty');
          });
        } else {
          cy.log('No payments found - table structure is still valid');
        }
      });
    });

    it('should handle navigation back from worker payments page', () => {
      // Navigate to worker payments page
      cy.visit('/worker-payments');
      
      // Verify we're on the correct page
      cy.url({ timeout: 10000 }).should('include', '/worker-payments');
      
      // Navigate to dashboard or another page to test navigation
      cy.visit('/dashboard');
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
      
      // Navigate back to worker payments
      cy.visit('/worker-payments');
      cy.url({ timeout: 10000 }).should('include', '/worker-payments');
      
      // Verify page loads correctly again
      cy.contains('Worker Payments', { timeout: 10000 }).should('be.visible');
      cy.get('table', { timeout: 10000 }).should('be.visible');
    });
  });
});
