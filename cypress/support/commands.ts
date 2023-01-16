/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('getEl', (selector: string) => {
  return cy.get('[data-test="' + selector + '"]')
})

Cypress.Commands.add('checkFloatingSelector', (y: number) => {
  return cy
    .getEl('list-floating-selector')
    .should('be.visible')
    .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 8, ' + y + ')')
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getEl(selector: string): Chainable
      /**
       * Checks floating selector vertical position
       */
      checkFloatingSelector(y: number): Chainable
    }
  }
}

export {}
