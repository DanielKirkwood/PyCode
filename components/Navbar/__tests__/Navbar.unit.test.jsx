// /__tests__/Navbar.unit.test.jsx

/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import React from 'react'
import Navbar from '../Navbar'

jest.mock('next/link', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  return ({ children, href }) => React.cloneElement(React.Children.only(children), { href })
})

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('Navbar', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/')
  })

  test('should have login button if user unauthenticated', () => {
    render(<Navbar status="unauthenticated" />)

    const loginAnchorTag = screen.getByText('Login').closest('a')

    expect(loginAnchorTag).toBeInTheDocument()

    expect(loginAnchorTag).toHaveAttribute('href', '/login')
  })

  test('should logout and create button if user authenticated', () => {
    render(<Navbar status="authenticated" />)

    const CreateAnchorTag = screen.getByText(/Create/).closest('a')
    const LogoutButton = screen.getByText(/Logout/).closest('button')

    expect(CreateAnchorTag).toBeInTheDocument()
    expect(CreateAnchorTag).toHaveAttribute('href', '/challenges/create')

    expect(LogoutButton).toBeInTheDocument()
  })
})
