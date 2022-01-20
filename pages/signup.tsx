import { isEmail } from 'lib/auth/validate'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { FiUser, FiUserPlus } from 'react-icons/fi'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { RiLockPasswordFill, RiLockPasswordLine } from 'react-icons/ri'

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
  const [showPassword, setShowPassword] = useState(false)

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
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-200 font-body">
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <h1 className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">create an account</h1>
        <div className="mt-6">
          <form onSubmit={onFormSubmit}>
            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Full Name:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <FiUser className="inline-block align-middle" />
                </div>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  id="name"
                  ref={nameInput}
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Email Address:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <MdOutlineAlternateEmail className="inline-block align-middle" />
                </div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Password:
              </label>
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <RiLockPasswordLine className="inline-block align-middle" />
                  ) : (
                    <RiLockPasswordFill className="inline-block align-middle" />
                  )}
                </div>
                <input
                  id="password"
                  autoComplete="new-password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Confirm Password:
              </label>
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <RiLockPasswordLine className="inline-block align-middle" />
                  ) : (
                    <RiLockPasswordFill className="inline-block align-middle" />
                  )}
                </div>
                <input
                  id="confirmPassword"
                  autoComplete="new-password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center text-red-600 text-sm sm:text-base tracking-wide pb-4  w-full">
                <span>{error}</span>
              </div>
            )}
            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">create account</span>
                <span>
                  <FiUserPlus className="inline-block align-middle h-6 w-6 " />
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <Link href="/login">
            <a
              href="#"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 hover:underline text-xs text-center"
            >
              Have an account already?
            </a>
          </Link>
        </div>
      </div>
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
    </div> */}
    </section>
  )
}

export default Login
