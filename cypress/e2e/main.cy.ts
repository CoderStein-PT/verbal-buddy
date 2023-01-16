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
    cy.getEl('list-floating-selector')
      .should('be.visible')
      .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 8, 0)')
    cy.getEl('input-new-category').first().type('{downArrow}')
    cy.getEl('list-floating-selector')
      .should('be.visible')
      .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 8, 24)')
    cy.getEl('input-new-category').first().type('{enter}')

    cy.getEl('input-new-word').first().type('{upArrow}')
    cy.getEl('list-floating-selector')
      .should('be.visible')
      .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 8, 0)')
    cy.getEl('input-new-word').first().type('{downArrow}')
    cy.getEl('list-floating-selector')
      .should('be.visible')
      .should('have.css', 'transform', 'matrix(1, 0, 0, 1, 8, 24)')
    cy.getEl('input-new-word').first().type('{enter}')
  })

  // it('pre-fill data and play guess games', () => {
  //   cy.preFillState()

  //   cy.playGuessGame()
  //   cy.playGuessGame()
  //   cy.playGuessGame()

  //   cy.getEl('guess-stats-main').children().should('have.length', 3)
  // })
})
