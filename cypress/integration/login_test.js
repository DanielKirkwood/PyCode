/// <reference types="cypress" />

describe('Login', () => {
  let user
  let newUserId
  before(() => {
    cy.fixture('user.json').then((fData) => {
      user = fData

      cy.request({
        failOnStatusCode: false,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/api/auth/signup',
        body: {
          name: user.name,
          email: user.email,
          password: user.password,
          confirmPassword: user.password,
        },
      }).then((res) => {
        if (res.body.success) {
          newUserId = res.body.payload.insertedId
        } else {
          newUserId = res.body.payload.existingUser._id
        }
      })
    })
  })

  beforeEach(() => {
    cy.visit('/login')
    cy.get('form').findByRole('button', { name: /Login/i }).as('submit')
  })

  after(() => {
    cy.request({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `/api/users/${newUserId}`,
    })
  })

  it('should validate inputs', () => {
    // check empty field validation
    cy.get('@submit').click()
    cy.findByText(/Please fill out all fields/i)

    // check invalid email
    cy.findByLabelText(/Email/i).type('not an email')
    cy.findByLabelText(/Password/i).type(user.password)
    cy.get('@submit').click()
    cy.findByText(/Email is not valid/i).should('exist')

    // check email password do not match
    cy.findByLabelText(/Email/i).clear().type(user.email)
    cy.findByLabelText(/Password/i)
      .clear()
      .type('incorrect password')
    cy.get('@submit').click()
    cy.findByText(/Your email\/password combination was incorrect/i)
  })

  it('should login existing user', () => {
    // fill required fields
    cy.findByLabelText(/Email/i).type(user.email)
    cy.findByLabelText(/Password/i).type(user.password)

    cy.get('@submit').click()
    cy.wait(3000)

    // check re-routed to challenges page
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/challenges')
    })

    // confirm user logged in by checking cookies
    console.log('cypress env ->', Cypress.env('NODE_ENV'))
    const cookieName =
      Cypress.env('NODE_ENV') === 'development' ? 'next-auth.session-token' : '__Secure-next-auth.session-token'

    cy.getCookie(cookieName).should('exist')
  })
})
