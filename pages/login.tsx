import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

const Login: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const emailInput = useRef(null)

  useEffect(() => {
    emailInput.current.focus()
  }, [])

  // TODO: Handle form submit with next-auth

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign in to your account</h3>
        <form action="">
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                ref={emailInput}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <span className="text-xs tracking-wide text-red-600">Email field is required </span>
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
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Sign in
              </button>
              <Link href="/">
                <a className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </Link>
            </div>
          </div>
        </form>
        <div className="flex justify-between items-center mt-3">
          <hr className="w-full" />
          <span className="p-2 text-gray-400 mb-1">OR</span>
          <hr className="w-full" />
        </div>
        <button className="relative block h-12 mt-3 text-google-button-grey w-full rounded border  bg-white hover:bg-gray-50 ">
          <FcGoogle className="absolute top-1/2 transform -translate-y-1/2 left-10 text-xl" />
          Sign in with Google
        </button>
        <button className="relative block h-12 mt-3 text-white w-full rounded bg-gray-900 hover:bg-gray-700">
          <FaGithub className="absolute top-1/2 transform -translate-y-1/2 left-10 text-xl" />
          Sign in with GitHub
        </button>
        <Link href="/signup">
          <a className="block text-sm text-center pt-5 text-blue-600 hover:underline">Not got an account?</a>
        </Link>
      </div>
    </div>
  )
}

export default Login
