// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
      logout(): void;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string): void => {
  // Intercept auth-related requests
  cy.intercept('GET', '/api/auth/csrf').as('csrf');
  cy.intercept('POST', '/api/auth/callback/credentials?*').as('login');
  cy.intercept('GET', '/api/auth/session').as('session');
  cy.intercept('GET', '/api/auth/providers').as('providers');

  // Visit login page and perform login
  cy.visit('/auth/signin');
  
  // Wait for page to load
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
  cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible');
  
  // Enter credentials
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();

  // Wait for the login request
  cy.wait('@login', { timeout: 15000 }).then((interception) => {
    // Check if login was successful
    if (interception.response && interception.response.statusCode === 200) {
      cy.log('Login request successful');
      // Additional wait for redirect processing
      cy.wait(2000);
    } else {
      cy.log('Login request failed with status: ' + interception.response?.statusCode);
      throw new Error('Login failed');
    }
  });
});

Cypress.Commands.add('logout', (): void => {
  // Set up interception before clicking logout
  cy.intercept('POST', '/api/auth/signout*').as('signout');
  cy.intercept('GET', '/auth/signin*').as('redirectToSignin');
  
  // Click the sign out button using test id for reliability
  cy.get('[data-testid="logout-button"]').should('be.visible').click();
  
  // Wait for either the signout request OR the redirect (NextAuth might handle logout differently)
  cy.window().then(() => {
    // Check if we can catch the signout request
    cy.get('body').then(() => {
      // Try to wait for signout request, but don't fail if it doesn't happen
      // (NextAuth might handle logout client-side)
      cy.wait(1000); // Give time for potential request
    });
  });
  
  // Wait for redirect to signin page (more reliable indicator of logout)
  cy.url({ timeout: 15000 }).should('include', '/auth/signin');
});

export {};
