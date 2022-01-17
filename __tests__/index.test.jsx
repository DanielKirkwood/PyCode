// __tests__/index.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import Home from '../pages/index'

jest.mock(
  'next/image',
  () =>
    function Image({ src, alt }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} />
    }
)

const wrapWithSession = (session, component) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {component}
    </SessionProvider>
  )
}

describe('Home', () => {
  it('renders the main heading', async () => {
    render(wrapWithSession(null, <Home />))

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Develop Your Python Skills',
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders login button if user not signed in', () => {
    render(wrapWithSession(null, <Home />))

    const button = screen.getByTestId('call-to-action')

    expect(button).toBeInTheDocument()

    expect(button).toHaveAttribute('href', '/login')
  })

  it('renders create challenge button if user signed in', () => {
    const session = {
      expires: '1',
      user: { email: 'user@email.com', name: 'John Doe', image: 'url-to-image' },
    }

    render(wrapWithSession(session, <Home />))

    const button = screen.getByTestId('call-to-action')

    expect(button).toBeInTheDocument()

    expect(button).toHaveAttribute('href', '/challenges/create')
  })
})
