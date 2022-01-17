import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

function isActive(router, url: string): boolean {
  return router.asPath === url
}

type Props = {
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

export default function NavMobile({ status }: Props): JSX.Element {
  const router = useRouter()
  return (
    <nav className="flex flex-col md:hidden pb-6 text-center last:mb-0">
      <Link href="/">
        <a
          className={`mb-3 hover:border-b-2 hover:border-white ${
            isActive(router, '/') ? 'border-b-2 border-white ' : 'border-0'
          }`}
        >
          Home
        </a>
      </Link>
      <Link href="/challenges">
        <a
          className={`mb-3  hover:border-b-2 hover:border-white ${
            isActive(router, '/challenges') ? 'border-b-2 border-white ' : 'border-0'
          }`}
        >
          Challenges
        </a>
      </Link>
      {status === 'authenticated' && (
        <>
          <Link href="/challenges/create">
            <a
              className={`mb-3  hover:border-b-2 hover:border-white ${
                isActive(router, '/challenges/create') ? 'border-b-2 border-white ' : 'border-0'
              }`}
            >
              Create
            </a>
          </Link>
          <button onClick={() => signOut({ redirect: false })} className="hover:border-b-2 hover:border-white">
            Logout
          </button>
        </>
      )}
      {status === 'unauthenticated' && (
        <Link href="/login">
          <a
            className={`mb-3  hover:border-b-2 hover:border-white ${
              isActive(router, '/login') ? 'border-b-2 border-white ' : 'border-0'
            }`}
          >
            Login
          </a>
        </Link>
      )}
    </nav>
  )
}
