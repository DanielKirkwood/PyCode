// /__tests__/Pagination.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Pagination from '../../components/Pagination/Pagination'

describe('Pagination', () => {
  test('should display a Pagination component', async () => {
    const user = userEvent.setup()

    let skip = 0
    const onSkipFn = jest.fn()

    render(
      <Pagination limit={5} skip={skip} numRows={5} totalRows={15} numRowsRemaining={10} onSkipBtnClick={onSkipFn} />
    )

    // check there is previous and next buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    const nextBtn = buttons[1]
    const prevBtn = buttons[0]

    // check previous button disabled on first page
    console.log('prevBtn ->', prevBtn)
    expect(prevBtn).toHaveProperty('disabled', true)

    // check butons run onSkipFn when clicked
    onSkipFn.mockImplementation((n) => (skip = n))
    await user.click(nextBtn)
    expect(onSkipFn).toBeCalledTimes(1)
  })
})
