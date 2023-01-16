import { dataPrefill } from '../fixtures/data-prefill'

describe('Categories', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  // it('fill basic data', () => {
  //   cy.fillData()
  // })

  // it('pre-fill data and use up and down keys for navigation in lists', () => {
  //   cy.preFillState()

  //   cy.getEl('input-new-category').first().type('{downArrow}')
  //   cy.checkFloatingSelector(0)
  //   cy.getEl('input-new-category').first().type('{downArrow}')
  //   cy.checkFloatingSelector(24)
  //   cy.getEl('input-new-category').first().type('{enter}')

  //   cy.getEl('input-new-word').first().type('{upArrow}')
  //   cy.checkFloatingSelector(0)
  //   cy.getEl('input-new-word').first().type('{downArrow}')
  //   cy.checkFloatingSelector(24)
  //   cy.getEl('input-new-word').first().type('{enter}')

  //   cy.getEl('input-add-definitions').first().type('{downArrow}')
  //   cy.checkFloatingSelector(0)
  //   cy.getEl('input-add-definitions').first().type('{downArrow}{downArrow}')
  //   cy.checkFloatingSelector(24)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{upArrow}{upArrow}{upArrow}{upArrow}')
  //   cy.checkFloatingSelector(0)
  // })

  it('pre-fill data and use page navigation with arrows', () => {
    cy.preFillState()

    cy.getEl('input-new-category').first().type('{downArrow}{enter}')

    cy.getEl('input-new-word').first().type('{ctrl}', { release: false })
    cy.getEl('input-new-word').first().type('{leftArrow}')
    // now we check if we're on the previous page
    cy.url().should('eq', 'http://localhost:3000/')
    cy.getEl('input-new-category').first().type('{ctrl}', { release: false })
    cy.getEl('input-new-category').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{downArrow}{enter}')

    cy.getEl('input-add-definitions').first().type('{ctrl}', { release: false })
    cy.getEl('input-add-definitions').first().type('{leftArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{ctrl}', { release: false })
    cy.getEl('input-new-word').first().type('{leftArrow}')
    cy.url().should('eq', 'http://localhost:3000/')
    cy.getEl('input-new-category').first().type('{ctrl}', { release: false })
    cy.getEl('input-new-category').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{ctrl}', { release: false })
    cy.getEl('input-new-word').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/word/1')
  })

  // it('pre-fill data and use page navigation with arrows', () => {
  //   cy.preFillState()
  //   cy.visit('localhost:3000/word/1')
  //   cy.getEl('input-add-definitions').first().type('{rightArrow}')
  //   cy.url().should('eq', 'http://localhost:3000/word/2')
  //   cy.getEl('input-add-definitions').first().type('{rightArrow}')
  //   cy.url().should('eq', 'http://localhost:3000/word/2')
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.url().should('eq', 'http://localhost:3000/word/1')
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.url().should('eq', 'http://localhost:3000/word/1')
  // })

  // it('pre-fill data and use page navigation with arrows', () => {
  //   cy.preFillState()
  //   cy.visit('localhost:3000/word/1')
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{option}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{rightArrow}')
  //   cy.getEl('input-add-props').should('exist')
  //   cy.getEl('input-add-props').first().type('{option}', { release: false })
  //   cy.getEl('input-add-props').first().type('{rightArrow}')
  //   cy.getEl('input-add-opposites').should('exist')
  //   cy.getEl('input-add-opposites').first().type('{option}', { release: false })
  //   cy.getEl('input-add-opposites').first().type('{rightArrow}')
  //   cy.getEl('input-add-opposites').should('exist')
  //   cy.getEl('input-add-opposites').first().type('{option}', { release: false })
  //   cy.getEl('input-add-opposites').first().type('{leftArrow}')
  //   cy.getEl('input-add-props').should('exist')
  //   cy.getEl('input-add-props').first().type('{option}', { release: false })
  //   cy.getEl('input-add-props').first().type('{leftArrow}')
  //   cy.getEl('input-add-definitions').should('exist')
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{option}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.getEl('input-add-definitions').should('exist')
  //   cy.getEl('input-add-definitions').first().type('abc{leftArrow}')
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{option}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{rightArrow}')
  //   cy.getEl('input-add-definitions').should('exist')
  // })

  // it('pre-fill data and use word page navigation', () => {
  //   cy.preFillState()
  //   cy.visit('localhost:3000/word/1')
  //   cy.getEl('word-editor-definitions').children().should('have.length', 3)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type(
  //       dataPrefill.words[1].text.toLowerCase().replace(/[- ]/g, '') +
  //         '{downArrow}{enter}'
  //     )

  //   cy.getEl('word-editor-definitions').children().should('have.length', 4)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{downArrow}{downArrow}{downArrow}{downArrow}{enter}')
  //   cy.getEl('word-editor-header')
  //     .first()
  //     .should(
  //       'contain',
  //       dataPrefill.words[0].text + ' - ' + dataPrefill.words[1].text
  //     )
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('abc{shift}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.getEl('word-editor-header')
  //     .first()
  //     .should(
  //       'contain',
  //       dataPrefill.words[0].text + ' - ' + dataPrefill.words[1].text
  //     )
  //   cy.getEl('input-add-definitions').first().clear()
  //   cy.getEl('word-editor-definitions').children().should('have.length', 3)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{shift}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.getEl('word-editor-definitions').children().should('have.length', 4)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{shift}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{leftArrow}')
  //   cy.getEl('word-editor-definitions').children().should('have.length', 4)
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{shift}', { release: false })
  //   cy.getEl('input-add-definitions').first().type('{rightArrow}')
  //   cy.getEl('word-editor-definitions').children().should('have.length', 3)
  // })

  // it('pre-fill data and create a new word right in the definitions of the current word', () => {
  //   cy.preFillState()
  //   cy.visit('localhost:3000/word/1')
  //   cy.getEl('word-editor-definitions').children().should('have.length', 3)
  //   cy.getEl('input-add-definitions').first().type('Random Word')
  //   cy.getEl('input-add-definitions')
  //     .first()
  //     .type('{shift}{enter}', { release: false })
  //   cy.getEl('word-editor-definitions').children().should('have.length', 4)
  //   // Here we check whether the created word was added to the global list of words (using shift+enter)
  //   cy.getEl('word-editor-definitions')
  //     .children()
  //     .eq(3)
  //     .children()
  //     .eq(3)
  //     .children()
  //     .should('have.length', 1)
  // })

  // it('pre-fill data and play guess games', () => {
  //   cy.preFillState()

  //   cy.playGuessGame()
  //   cy.playGuessGame()
  //   cy.playGuessGame()

  //   cy.getEl('guess-stats-main').children().should('have.length', 3)
  // })
})
