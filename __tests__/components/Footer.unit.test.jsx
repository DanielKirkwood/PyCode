// /__tests__/Checkbox.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Footer from '../../components/Footer/Footer'

describe('Footer', () => {
  test('renders a footer', () => {
    render(<Footer status="authenticated" />)

    // check for link to applications GitHub
    expect(screen.getByText(/DanielKirkwood\/pycode/i)).toBeInTheDocument()
    expect(screen.getByText(/DanielKirkwood\/pycode/i)).toHaveAttribute(
      'href',
      'https://github.com/DanielKirkwood/pycode'
    )

    expect(screen.getAllByRole('link')).toHaveLength(5)
  })
})
