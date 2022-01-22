// /__tests__/ChallengeCard.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import React from 'react'
import ChallengeCard from '../ChallengeCard'

jest.mock('next/link', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  return ({ children, href }) => React.cloneElement(React.Children.only(children), { href })
})

describe('ChallengeCard', () => {
  test('should display a challenges details ', () => {
    const fakeChallenge = {
      id: 12345678,
      title: 'My Fake Challenge Title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eros donec ac odio tempor. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Eget duis at tellus at urna condimentum. Aliquam nulla facilisi cras fermentum odio eu feugiat. Amet nisl suscipit adipiscing bibendum. Netus et malesuada fames ac.',
    }
    const { getByText } = render(
      <ChallengeCard id={fakeChallenge.id} title={fakeChallenge.title} description={fakeChallenge.description} />
    )

    const titleNode = getByText(fakeChallenge.title)
    const descriptionNode = getByText(fakeChallenge.description)
    const challengePageAnchorNode = getByText(/Try Challenge/)

    expect(titleNode).toHaveTextContent(fakeChallenge.title)
    expect(descriptionNode).toHaveTextContent(fakeChallenge.description)
    expect(challengePageAnchorNode).toHaveAttribute('href', `/challenges/${fakeChallenge.id}`)
  })
})
