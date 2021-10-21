// __tests__/index.test.jsx

/**
 * @jest-environment jsdom
 */

import React from "react"
import { render, screen } from "@testing-library/react"
import Home from "../pages/index"

jest.mock(
  'next/image',
  () =>
    function Image({ src, alt }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} />
    }
)

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Develop Your Python Skills',
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders a sign-in button', () => {
    render(<Home />)

    const button = screen.getByTestId('sign-up button')

    expect(button).toBeInTheDocument()

    expect(button).toHaveAttribute('href', '/')
  })
})
