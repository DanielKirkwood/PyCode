// /__tests__/ChallengeList.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import ChallengeList from '../ChallengeList'

describe('ChallengeList', () => {
  test('should display a list of challenges', () => {
    const fakeChallenges = [
      {
        _id: 11111111,
        title: 'My Fake Challenge Title',
        description: 'This is description 1.',
      },
      {
        _id: 22222222,
        title: 'The 2nd best challenge',
        description: 'Description 2 reporting for duty.',
      },
      {
        _id: 33333333,
        title: 'Threes a crowd',
        description: 'I am starting to run out of ideas.',
      },
    ]

    render(<ChallengeList data={fakeChallenges} />)

    expect(screen.getAllByText(/Try Challenge/).length === fakeChallenges.length)

    screen.getAllByText(/Try Challenge/).forEach((anchorTag, index) => {
      expect(anchorTag).toHaveAttribute('href', `/challenges/${fakeChallenges[index]._id}`)
    })
  })
})
