// Import commands.js using ES2015 syntax:
import './commands';

// Handle uncaught exceptions from the application
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test due to uncaught application errors
  console.log('Uncaught exception:', err.message);
  return false;
});

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}
