/// <reference types="cypress" />

describe('Challenges Page', () => {
  context('unauthenticated user', () => {
    beforeEach(() => {
      cy.visit('/challenges')
      cy.intercept('POST', '/api/code?execute=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          success: true,
          payload: {
            messages: [
              {
                line: 2,
                message: 'Final newline missing',
                messageID: 'C0304',
                symbol: 'missing-final-newline',
                type: 'convention',
              },
              {
                line: 1,
                message: "Unused argument 's'",
                messageID: 'W0613',
                symbol: 'unused-argument',
                type: 'warning',
              },
            ],
          },
        },
      }).as('lint')
    })

    it('should allow user to attempt challenge', () => {
      // attempt the first challenge
      cy.findAllByRole('link', { name: /Try Challenge/i })
        .first()
        .click()

      cy.findByRole('heading', { level: 1 }).should('exist')

      // check code editor functionality
      cy.findByRole('textbox')
        .type('{end}', { force: true })
        .type('{enter}', { force: true })
        .type('x = 1', { force: true })
      cy.findByRole('textbox').should('contain.value', 'x = 1')

      // unauthenitcated users asked to sign in
      cy.findByText(/Sign in to save your code/i).should('exist')

      // check code linter works
      cy.findByText(/Check Code Style/i).should('exist')
      cy.findByRole('table').should('not.be.visible')

      cy.findByText(/Check Code Style/i).click()
      cy.wait('@lint')
      cy.findByRole('table').should('be.visible')

      // check running tests - minimum 3 tests required
      cy.findAllByText(/Run test/i).should('have.length.at.least', 3)

      cy.findByRole('heading', { level: 3, name: /^Here you can view/i }).as('console')

      cy.get('@console').then(($console) => {
        let console = $console.text()

        cy.findByRole('button', { name: /Run test 1/i })
          .first()
          .click()

        cy.get('@console').then(($console2) => {
          expect(console).to.not.equal($console2.text())
        })
      })
    })
  })
})
