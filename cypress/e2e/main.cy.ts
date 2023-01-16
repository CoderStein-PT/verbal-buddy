describe('Categories', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  // it('fill basic data', () => {
  //   cy.fillData()
  // })

  it('pre-fill data and use up and down keys for navigation in lists', () => {
    cy.preFillState()

    cy.getEl('input-new-category').first().type('{downArrow}')
    cy.checkFloatingSelector(0)
    cy.getEl('input-new-category').first().type('{downArrow}')
    cy.checkFloatingSelector(24)
    cy.getEl('input-new-category').first().type('{enter}')

    cy.getEl('input-new-word').first().type('{upArrow}')
    cy.checkFloatingSelector(0)
    cy.getEl('input-new-word').first().type('{downArrow}')
    cy.checkFloatingSelector(24)
    cy.getEl('input-new-word').first().type('{enter}')

    cy.getEl('input-add-definitions').first().type('{downArrow}')
    cy.checkFloatingSelector(0)
    cy.getEl('input-add-definitions').first().type('{downArrow}{downArrow}')
    cy.checkFloatingSelector(24)
    cy.getEl('input-add-definitions')
      .first()
      .type('{upArrow}{upArrow}{upArrow}{upArrow}')
    cy.checkFloatingSelector(0)
  })

  it('pre-fill data and use page navigation with arrows', () => {
    cy.preFillState()

    cy.getEl('input-new-category').first().type('{downArrow}{enter}')

    cy.getEl('input-new-word').first().type('{meta}', { release: false })
    cy.getEl('input-new-word').first().type('{leftArrow}')
    // now we check if we're on the previous page
    cy.url().should('eq', 'http://localhost:3000/')
    cy.getEl('input-new-category').first().type('{meta}', { release: false })
    cy.getEl('input-new-category').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{downArrow}{enter}')

    cy.getEl('input-add-definitions').first().type('{meta}', { release: false })
    cy.getEl('input-add-definitions').first().type('{leftArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{meta}', { release: false })
    cy.getEl('input-new-word').first().type('{leftArrow}')
    cy.url().should('eq', 'http://localhost:3000/')
    cy.getEl('input-new-category').first().type('{meta}', { release: false })
    cy.getEl('input-new-category').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/category/1')
    cy.getEl('input-new-word').first().type('{meta}', { release: false })
    cy.getEl('input-new-word').first().type('{rightArrow}')
    cy.url().should('eq', 'http://localhost:3000/word/1')
  })

  // it('pre-fill data and play guess games', () => {
  //   cy.preFillState()

  //   cy.playGuessGame()
  //   cy.playGuessGame()
  //   cy.playGuessGame()

  //   cy.getEl('guess-stats-main').children().should('have.length', 3)
  // })
})
