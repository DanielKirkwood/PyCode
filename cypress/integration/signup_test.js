/// <reference types="cypress" />

describe('Sign-up', () => {
  let data
  before(() => {
    cy.fixture('credentials').then((fData) => {
      data = fData
    })
  })

  beforeEach(() => {
    cy.visit('/signup')
    cy.get('form')
      .findByRole('button', { name: /Create Account/i })
      .as('submit')
  })

  it('should validate sign-up form', () => {
    // check not valid if form inputs empty
    cy.get('@submit').click()
    cy.findByText(/Please fill out all fields/i).should('exist')

    cy.findByLabelText(/^Full Name/i).type(data.user.name)
    cy.findByLabelText(/^Password/i).type(data.user.password)
    cy.findByLabelText(/^Confirm Password/i).type(data.user.password)

    // check invalid email
    cy.findByLabelText(/^Email/i)
      .clear()
      .type('notvalidemail')
    cy.get('@submit').click()
    cy.findByText(/Email is not valid/i).should('exist')
    cy.findByLabelText(/^Email/i)
      .clear()
      .type(data.user.email)

    // check mismatched password validation
    cy.findByLabelText(/^Confirm Password/i)
      .clear()
      .type('wrong password')
    cy.get('@submit').click()
    cy.findByText(/Passwords do not match/i).should('exist')
  })

  it('should successfully signup user', () => {
    // sub API response
    cy.intercept(
      {
        method: 'POST',
        url: '/api/auth/signup',
      },
      [
        {
          success: true,
          payload: {
            message: 'User Created',
            acknowledged: true,
            insertedId: 12345678,
          },
        },
      ]
    ).as('signupUser')

    // fill required fields
    cy.findByLabelText(/^Full Name/i).type(data.user.name)
    cy.findByLabelText(/^Email/i).type(data.user.email)
    cy.findByLabelText(/^Password/i).type(data.user.password)
    cy.findByLabelText(/^Confirm Password/i).type(data.user.password)

    // submit form and wait for API stubbed response
    cy.get('@submit').click()
    cy.wait('@signupUser')

    // check we are re-routed to login page and success message displayed to user
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/login')
      expect(loc.search).to.contain('account_created')
    })
    cy.findByText(/^Success/).should('exist')
  })
})
