// /__tests__/Checkbox.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from '../../components/Checkbox/Checkbox'

describe('Checkbox', () => {
  test('should render unchecked/checked checkbox', () => {
    const mockedOnToggle = jest.fn()

    const { rerender } = render(<Checkbox text="text" value={false} handleCheckboxToggle={mockedOnToggle} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveProperty('checked', false)

    rerender(<Checkbox text="text" value={true} handleCheckboxToggle={mockedOnToggle} />)

    expect(checkbox).toHaveProperty('checked', true)
  })

  test('should execute fn on click', async () => {
    const user = userEvent.setup()
    const mockedOnToggle = jest.fn()

    render(<Checkbox text="text" value={false} handleCheckboxToggle={mockedOnToggle} />)
    const checkbox = screen.getByRole('checkbox')

    await user.click(checkbox)
    expect(mockedOnToggle.mock.calls.length).toBe(1)

    await user.click(checkbox)
    expect(mockedOnToggle.mock.calls.length).toBe(2)
  })
})
