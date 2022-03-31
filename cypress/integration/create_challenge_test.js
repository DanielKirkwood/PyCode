/// <reference types="cypress" />

describe('Create Challenge', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.wait('@session')
    cy.visit('/challenges/create')
  })

  it('should allow user to create challenge', () => {
    const challengeData = {
      title: 'Cypress Test',
      description:
        'This challenge was created by Cypress for testing purposes. If you are seeing this, please notify an admin.',
      testCases: [
        {
          inputName: 'nums',
          inputValue: '[1,2,3]',
          output: '2',
        },
        {
          inputName: 'nums',
          inputValue: '[3,2,1]',
          output: '2',
        },
        {
          inputName: 'nums',
          inputValue: '[2,3,1]',
          output: '3',
        },
        {
          inputName: 'DELETE ME',
          inputValue: '[]',
          output: '0',
        },
      ],
    }

    cy.findByRole('button', { name: /Next Step/i }).as('nextBtn')

    // fill out title and description
    cy.findByLabelText(/Title/i).type(challengeData.title)
    cy.findAllByLabelText(/Description/i).type(challengeData.description)
    cy.get('@nextBtn').click()
    // loop over challenge data to create as many challenges as we want
    challengeData.testCases.forEach((testCase, index) => {
      // add a test case
      cy.findByText(/Add test case/i)
        .as('addTest')
        .click()

      // findAll* may return more than 1 element, we can only click one therefore, iterate over them and click the one we want
      cy.findAllByLabelText(/Edit Test/i).each(($btn, i) => {
        if (i === index) {
          cy.wrap($btn).click()
        }
      })
      // fill in details
      cy.findByPlaceholderText(/^input name/i).type(testCase.inputName)
      cy.findByPlaceholderText(/^input value/i).type(testCase.inputValue)
      cy.findByPlaceholderText(/^output value/i).type(testCase.output)
      // save
      cy.findByRole('button', { name: /save test/i }).click()
    })

    // delete last test
    cy.findAllByLabelText(/Edit Test/i)
      .last()
      .click()
    cy.findByRole('button', { name: /delete test/i }).click()
    cy.get('@nextBtn').click()
  })
})
