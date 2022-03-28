/// <reference types="cypress" />

describe('Login', () => {
  let user
  before(() => {
    cy.fixture('users.json').then((fData) => {
      // pick a random user for tests
      user = fData.users[Math.floor(Math.random() * fData.users.length)]
    })
  })

  beforeEach(() => {
    cy.visit('/login')
    cy.get('form').findByRole('button', { name: /Login/i }).as('submit')
  })

  it('should validate inputs', () => {
    // check empty field validation
    cy.get('@submit').click()
    cy.findByText(/Please fill out all fields/i)

    // check invalid email
    cy.findByLabelText(/Email/i).type('not an email')
    cy.findByLabelText(/Password/i).type('password')
    cy.get('@submit').click()
    cy.findByText(/Email is not valid/i).should('exist')
  })

  it('should login existing user', () => {
    let newUserId

    // create new user in order to login, storing _id so we can delete
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

    // fill required fields
    cy.findByLabelText(/Email/i).type(user.email)
    cy.findByLabelText(/Password/i).type(user.password)

    cy.get('@submit').click()

    // check re-routed to challenges page
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/challenges')
    })

    // confirm user logged in by checking cookies
    const cookieName =
      Cypress.env('NODE_ENV') === 'development' ? 'next-auth.session-token' : '__Secure-next-auth.session-token'
    cy.getCookie(cookieName).should('exist')

    // delete new user from database
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `/api/users/${newUserId}`,
    })
  })
})
