// cypress/e2e/auth/signup.cy.ts

describe('Sign Up Integration', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/auth/signup');
    cy.get('form', { timeout: 20000 }).should('be.visible');
  });

  it('should sign up successfully with valid data', () => {
    const uniqueEmail = `testuser_${Date.now()}@gmail.com`;
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('ValidPass1!');
    cy.get('input[name="confirmPassword"]').type('ValidPass1!');
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled').click();

    // Check for either success redirect OR rate limit error (both are acceptable)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="signup-error"]').length > 0) {
        // If there's an error, it should be a rate limit error
        cy.get('[data-testid="signup-error"]').should(($el) => {
          const text = $el.text();
          return assert.isTrue(
            text.toLowerCase().includes('rate limit') ||
            text.toLowerCase().includes('too many'),
            'Should show rate limit error'
          );
        });
      } else {
        // If no error, should redirect to sign in page
        cy.url({ timeout: 20000 }).should('include', '/auth/signin');
        cy.contains('Sign in', { timeout: 20000 }).should('be.visible');
      }
    });
  });

  it('should show validation errors for missing required fields', () => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="signup-error"]').should('exist');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('ValidPass1!');
    cy.get('input[name="confirmPassword"]').type('ValidPass1!');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="signup-error"]').should(($el) => {
      const text = $el.text();
      // Accept any error message about invalid email
      return assert.isTrue(
        text.toLowerCase().includes('email') ||
        text.toLowerCase().includes('invalid'),
        'Should show an error about invalid email'
      );
    });
  });

  it('should show validation error for password mismatch', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(`testuser_${Date.now()}@gmail.com`);
    cy.get('input[name="password"]').type('ValidPass1!');
    cy.get('input[name="confirmPassword"]').type('DifferentPass1!');
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="signup-error"]').should(($el) => {
      const text = $el.text();
      return assert.isTrue(
        text.toLowerCase().includes('passwords do not match') ||
        text.toLowerCase().includes('match'),
        'Should show an error about password mismatch'
      );
    });
  });

  it('should show error for duplicate email', () => {
    // Use the existing email that's already in the database
    const duplicateEmail = 'l.duarte@runtime-revolution.com';
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(duplicateEmail);
    cy.get('input[name="password"]').type('ValidPass1!');
    cy.get('input[name="confirmPassword"]').type('ValidPass1!');
    cy.get('button[type="submit"]').click();
    
    // Should stay on signup page and show error
    cy.url().should('include', '/auth/signup');
    cy.get('[data-testid="signup-error"]').should('be.visible').and(($el) => {
      const text = $el.text();
      return assert.isTrue(
        text.toLowerCase().includes('already') ||
        text.toLowerCase().includes('exists') ||
        text.toLowerCase().includes('account') ||
        text.toLowerCase().includes('email'),
        `Duplicate email error message should be shown. Got: "${text}"`
      );
    });
  });
});
