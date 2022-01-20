import PopupMessage from '@/components/PopupMessage'
import { isEmail } from 'lib/auth/validate'
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { FiUserPlus } from 'react-icons/fi'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { RiLockPasswordLine, RiLoginCircleLine } from 'react-icons/ri'

const Login: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session } = useSession()

  // use router for pushing to auth or getting errors
  const router: NextRouter = useRouter()

  // user entered data stored in state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // to display errors to user
  const [error, setError] = useState('')
  const [messageVisible, setMessageVisible] = useState(false)
  const [message, setMessage] = useState({
    type: null,
    body: '',
  })

  // use ref for auto focusing email input on page load
  const emailInput = useRef(null)

  useEffect(() => {
    // if user is already logged in, send to challenges page
    if (session) {
      router.push('/challenges')
    }
    if (router.query.message === 'account_created') {
      setMessage({
        type: 'Success',
        body: 'Account created successfully - try logging in now',
      })
      setMessageVisible(true)
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
      router.push('/challenges')
      return
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-200 font-body">
      {messageVisible && (
        <PopupMessage type={message.type} body={message.body} onAnimationEnd={() => setMessageVisible(false)} />
      )}
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <h1 className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Login</h1>
        <button
          onClick={() => signIn('google')}
          className="relative mt-6 border rounded-md py-2 text-sm text-google-button-grey bg-white hover:bg-gray-100 "
        >
          <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500">
            <FcGoogle className="align-middle" />
          </span>
          <span>Login with Google</span>
        </button>
        <button
          onClick={() => signIn('github')}
          className="relative mt-6 border rounded-md py-2 text-sm text-white bg-black hover:bg-gray-800"
        >
          <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-white">
            <FaGithub className="align-middle" />
          </span>
          <span>Login with Github</span>
        </button>
        <div className="relative mt-10 h-px bg-gray-300">
          <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
            <span className="bg-white px-4 text-xs text-gray-500 uppercase">Or Login with Email</span>
          </div>
        </div>
        <div className="mt-10">
          <form onSubmit={onFormSubmit}>
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
                  ref={emailInput}
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
                  <RiLockPasswordLine className="inline-block align-middle" />
                </div>
                <input
                  id="password"
                  autoComplete="current-password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center text-red-600 text-sm sm:text-base tracking-wide pb-4 w-full">
                <span>{error}</span>
              </div>
            )}
            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Login</span>
                <span>
                  <RiLoginCircleLine className="inline-block align-middle h-6 w-6 " />
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <Link href="/signup">
            <a
              href="#"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 hover:underline text-xs text-center"
            >
              <span>
                <FiUserPlus className="inline-block align-middle" />
              </span>
              <span className="ml-2">Not got an account?</span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Login
