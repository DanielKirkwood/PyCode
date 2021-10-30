import type { NextPage } from 'next'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { NextRouter, useRouter } from 'next/router'
import { isEmail } from 'lib/auth/validate'

const Login: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session } = useSession()

  // use router for pushing to auth or getting errors
  const router: NextRouter = useRouter()

  // user entered data stored in state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // to display errors to user
  const [error, setError] = useState('')

  // use ref for auto focusing email input on page load
  const emailInput = useRef(null)

  useEffect(() => {
    // if user is already logged in, send to challenges page
    if (session) {
      router.push('/challenges')
    }
    // focus on email input
    emailInput.current.focus()
  }, [router, session])

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill out all fields')
      return
    }
    if (!isEmail(email)) {
      setError('Email is not valid')
      return
    }

    const status = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    })

    if (status.error !== null) {
      if (status.status === 401) {
        setError('Your email/password combination was incorrect')
        return
      } else {
        setError(status.error)
        return
      }
    } else {
      console.log(status)

      router.push('/challenges')
      return
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-center sm:text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign in to your account</h3>
        <form onSubmit={onFormSubmit}>
          <div className="mt-4 w-52 sm:w-96">
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
              {/* <span className="text-xs tracking-wide text-red-600">Email field is required </span> */}
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
            {error && <span className="text-xs tracking-wide text-red-600">{error}</span>}
            <div className="flex flex-col items-center sm:flex-row sm:items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Sign in
              </button>
              <Link href="/">
                <a className="mt-5 sm:mt-0 text-sm text-blue-600 hover:underline">Forgot password?</a>
              </Link>
            </div>
          </div>
        </form>
        <div className="flex justify-between items-center mt-3">
          <hr className="w-full" />
          <span className="p-2 text-gray-400 mb-1">OR</span>
          <hr className="w-full" />
        </div>
        <button
          onClick={() => signIn('google')}
          className="relative block h-12 mt-3 text-google-button-grey w-full rounded border  bg-white hover:bg-gray-50 "
        >
          <FcGoogle className="absolute top-1/2 transform -translate-y-1/2 left-10 text-xl" />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github')}
          className="relative block h-12 mt-3 text-white w-full rounded bg-gray-900 hover:bg-gray-700"
        >
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
