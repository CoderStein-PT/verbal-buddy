import { StoreType } from 'store'
import data from '../fixtures/data.json'
import { dataPrefill } from '../fixtures/data-prefill'

Cypress.Commands.add('fillData', () => {
  cy.getEl('input-new-category')
    .first()
    .type(data.categories.map((c) => c.name).join('{enter}') + '{enter}')
  cy.getEl('categories-list')
    .children()
    .should('have.length', data.categories.length)

  data.categories.forEach((category, index) => {
    cy.getEl('categories-list').children().eq(index).click()
    cy.getEl('input-new-word')
      .first()
      .type(category.words.map((w) => w.name).join('{enter}') + '{enter}')
    cy.getEl('words-list')
      .children()
      .should('have.length', category.words.length)

    category.words.forEach((word, index) => {
      cy.getEl('words-list').children().eq(index).click()
      cy.getEl('word-editor')
        .find('input')
        .first()
        .type(word.definitions.join('{enter}') + '{enter}')
      cy.getEl('word-editor-definitions')
        .children()
        .should('have.length', word.definitions.length)

      cy.getEl('word-editor-tabs').find('button').eq(1).click()
      cy.getEl('word-editor-props').should('contain', 'No Properties Yet')
      cy.getEl('word-editor-tabs').find('button').eq(2).click()
      cy.getEl('word-editor')
        .find('input')
        .first()
        .type(word.opposites.join('{enter}') + '{enter}')

      cy.getEl('word-editor-opposites')
        .children()
        .should('have.length', word.opposites.length)

      cy.getEl('nav-back-button').first().click()
    })
    cy.getEl('nav-back-button').first().click()
  })
})

Cypress.Commands.add('preFillState', () => {
  cy.window()
    .its('store')
    .then((store) => {
      store.setState((s: StoreType) => ({
        ...s,
        ...dataPrefill
      }))
    })
})

Cypress.Commands.add('playGuessGame', () => {
  cy.getEl('navbar').find('>a').eq(1).click()
  cy.getEl('btn-new-game').click()
  cy.getEl('categories-selector').children().should('have.length', 2)
  cy.getEl('btn-toggle-select-all').click()
  cy.getEl('btn-start-game').click()
  cy.getEl('btn-game-start').click()

  cy.wait(1200)

  let finished = false

  for (let i = 0; i < 100; i++) {
    cy.getEl('data-word').then((words) => {
      finished = words[0].getAttribute('data-test-finished') === 'true'
      if (finished) return

      const word = words[0].getAttribute('data-test-data')

      cy.getEl('input-game').type(word + '{enter}')
      cy.getEl('last-word-text').should('contain', word)
      cy.getEl('game-results-list').children().eq(i).should('contain', word)
    })

    if (finished) break
  }

  cy.getEl('navbar').find('>a').eq(1).click()
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillData(): void
      preFillState(): void
      playGuessGame(): void
    }
  }
}

export {}
