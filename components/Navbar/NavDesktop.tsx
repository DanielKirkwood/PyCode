import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { FaCode, FaHome } from 'react-icons/fa'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { MdOutlineCreate } from 'react-icons/md'

function isActive(router, url: string): boolean {
  return router.asPath === url
}

type Props = {
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

function NavDesktop({ status }: Props): ReactElement {
  const router = useRouter()

  return (
    <nav className="ml-auto items-center text-base justify-center hidden md:flex last:ml-0">
      <Link href="/">
        <a
          className={`mr-5 hover:border-b-2 hover:border-white ${
            isActive(router, '/') ? 'border-b-2 border-white  ' : 'border-0'
          }`}
        >
          <FaHome className="inline-block align-middle" />
          <span className="ml-2">Home</span>
        </a>
      </Link>
      <Link href="/challenges">
        <a
          className={`mr-5 hover:border-b-2 hover:border-white ${
            isActive(router, '/challenges') ? 'border-b-2 border-white' : 'border-0'
          }`}
        >
          <FaCode className="inline-block align-middle" />
          <span className="ml-2">Challenges</span>
        </a>
      </Link>

      {status === 'authenticated' && (
        <>
          <Link href="/challenges/create">
            <a
              className={`mr-5 hover:border-b-2 hover:border-white ${
                isActive(router, '/challenges/create') ? 'border-b-2 border-white' : 'border-0'
              }`}
            >
              <MdOutlineCreate className="inline-block align-middle" />
              <span className="ml-2">Create</span>
            </a>
          </Link>
          <button onClick={() => signOut({ redirect: false })} className="hover:border-b-2 hover:border-white">
            <span className="mr-2">Logout</span>
            <FiLogOut className="inline-block align-middle" />
          </button>
        </>
      )}
      {status === 'unauthenticated' && (
        <Link href="/login">
          <a
            className={`mr-5 hover:border-b-2 hover:border-white ${
              isActive(router, '/login') ? 'border-b-2 border-white' : 'border-0'
            }`}
          >
            <FiLogIn className="inline-block align-middle" />
            <span className="ml-2">Login</span>
          </a>
        </Link>
      )}
    </nav>
  )
}

export default NavDesktop
