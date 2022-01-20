import Link from 'next/link'
import React, { ReactElement } from 'react'

type Props = {
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

function NavBar({ status }: Props): ReactElement {
  return (
    <footer className="text-gray-600 font-display">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900 text-xl">
          PyCode
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          Github —
          <a
            href="https://github.com/DanielKirkwood/pycode"
            className="text-gray-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            DanielKirkwood/pycode
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link href="/">
            <a className="text-gray-500 px-2 hover:text-blue-500">Home</a>
          </Link>
          <Link href="/challenges">
            <a className="text-gray-500 px-2 hover:text-blue-500">Challenges</a>
          </Link>
          {status === 'unauthenticated' && (
            <Link href="/login">
              <a className="text-gray-500 px-2 hover:text-blue-500">Login</a>
            </Link>
          )}
          {status === 'authenticated' && (
            <Link href="/challenges/create">
              <a className="text-gray-500 px-2 hover:text-blue-500">Create</a>
            </Link>
          )}
        </span>
      </div>
    </footer>
  )
}

export default NavBar
