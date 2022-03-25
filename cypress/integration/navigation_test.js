/// <reference types="cypress" />

describe('Navigation', () => {
  context('Desktop resolution', () => {
    let data
    let userID
    before(() => {
      cy.fixture('credentials').then((fData) => {
        data = fData

        cy.request({
          failOnStatusCode: false,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          url: '/api/auth/signup',
          body: {
            name: data.user.name,
            email: data.user.email,
            password: data.user.password,
            confirmPassword: data.user.password,
          },
        }).then((res) => {
          if (res.body.success) {
            userID = res.body.payload.insertedId
          } else {
            userID = res.body.payload.existingUser._id
          }
        })
      })
    })

    beforeEach(() => {
      // run the tests in desktop browser with 720p  monitor
      cy.viewport(1280, 720)
      cy.visit('/')
    })

    after(() => {
      cy.request({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/api/users/${userID}`,
      })
    })

    it('should allow restricted navigation when signed out', () => {
      // Check login link
      cy.findAllByRole('link', { name: /Login/i }).first().click()
      cy.location('pathname').should('equal', '/login')

      // Check challenges link
      cy.findAllByRole('link', { name: /Challenges/i })
        .first()
        .click()
      cy.location('pathname').should('equal', '/challenges')

      // Check home link
      cy.findAllByRole('link', { name: /Home/i }).first().click()
      cy.location('pathname').should('equal', '/')
    })

    it.only('should allow full navigation when signed in', () => {
      cy.loginUser(data.user.email, data.user.password)

      cy.findAllByRole('button', { name: /Logout/i }).should('exist')

      cy.findAllByRole('link', { name: /Create/i }).should('exist')

      // Check challenges link
      cy.findAllByRole('link', { name: /Challenges/i })
        .first()
        .should('exist')

      // Check home link
      cy.findAllByRole('link', { name: /Home/i }).first().should('exist')

      cy.findAllByRole('button', { name: /Logout/i }).click()
    })

    context('Mobile resolution', () => {
      beforeEach(() => {
        // run the tests using mobile
        cy.viewport(414, 896)
        cy.visit('/')
      })

      it('should display mobile menu', () => {
        cy.findByLabelText(/toggle mobile menu/i).should('be.visible')
        cy.findByLabelText(/toggle mobile menu/i).click()

        cy.findAllByRole('link', { name: /Home/i }).first().should('be.visible')
      })
    })
  })
})
