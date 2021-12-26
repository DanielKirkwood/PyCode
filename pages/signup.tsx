import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { isEmail } from 'lib/auth/validate'

const Login: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session } = useSession()

  // use router for pushing to auth or getting errors
  const router: NextRouter = useRouter()

  // user entered data stored in state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // to display errors to user
  const [error, setError] = useState('')

  // use ref for auto focusing name input on page load
  const nameInput = useRef(null)

  useEffect(() => {
    // if user is already logged in, send to challenges page
    if (session) {
      router.push('/challenges')
    }
    nameInput.current.focus()
  }, [router, session])

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields')
      return
    }
    if (!isEmail(email)) {
      setError('Email is not valid')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }),
    })

    const data = await response.json()

    if (data.error) {
      setError(data.error.message)
      return
    }

    router.push({
      pathname: '/login',
      query: { message: 'account_created' },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-center sm:text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Create an account</h3>
        <form onSubmit={onFormSubmit}>
          <div className="mt-4 w-52 sm:w-96">
            <div>
              <label className="block" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                value={name}
                ref={nameInput}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            {error && <span className="text-xs tracking-wide text-red-600">{error}</span>}
            <div className="flex items-baseline justify-center sm:justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Create account
              </button>
            </div>
          </div>
        </form>
        <Link href="/login">
          <a className="block text-sm text-center pt-5 text-blue-600 hover:underline">Have an account already?</a>
        </Link>
      </div>
    </div>
  )
}

export default Login
