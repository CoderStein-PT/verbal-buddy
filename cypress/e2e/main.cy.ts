describe('Categories', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  it('fill basic data', () => {
    cy.fillData()
  })

  it('pre-fill data and play guess games', () => {
    cy.preFillState()

    cy.playGuessGame()
    cy.playGuessGame()
    cy.playGuessGame()

    cy.getEl('guess-stats-main').children().should('have.length', 3)
  })
})
