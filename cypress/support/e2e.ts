// Import commands.js using ES2015 syntax:
import './commands';

export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to log in a user
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
    }
  }
}
