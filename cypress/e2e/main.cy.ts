describe('Categories', () => {
  it('basic test', () => {
    cy.visit('localhost:3000')

    cy.getEl('input-new-category').first().type('Category 1{enter}')
    cy.getEl('categories-list').children().should('have.length', 1)
    cy.getEl('input-new-category').first().type('Category 2{enter}')
    cy.getEl('categories-list').children().should('have.length', 2)
  })
})
