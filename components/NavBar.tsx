import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaCode, FaHome, FaBars } from 'react-icons/fa'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineCreate } from 'react-icons/md'

function NavBar(): ReactElement {
  const { data: session, status } = useSession()

  const [navbarOpen, setNavbarOpen] = React.useState(false)
  const router = useRouter()

  function isActive(url: string): boolean {
    return router.asPath === url
  }

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-blue-500">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white">
                PyCode
              </a>
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
              data-testid="hamburger-icon"
            >
              <FaBars />
            </button>
          </div>
          <div
            className={'lg:flex flex-grow items-center' + (navbarOpen ? ' flex' : ' hidden')}
            data-testid="nav-items"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link href="/">
                  <a
                    className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                      isActive('/') ? 'border-b-2 border-white' : 'border-0'
                    }`}
                  >
                    <FaHome className="text-lg leading-lg text-white opacity-75" />
                    <span className="ml-2">Home</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/challenges">
                  <a
                    className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                      isActive('/challenges') ? 'border-b-2 border-white' : 'border-0'
                    }`}
                  >
                    <FaCode className="text-lg leading-lg text-white opacity-75" />
                    <span className="ml-2">Challenges</span>
                  </a>
                </Link>
              </li>
              {status === 'unauthenticated' && (
                <li className="nav-item">
                  <Link href="/login">
                    <a
                      className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                        isActive('/login') ? 'border-b-2 border-white' : 'border-0'
                      }`}
                    >
                      <FiLogIn className="text-lg leading-lg text-white opacity-75" />
                      <span className="ml-2">Login</span>
                    </a>
                  </Link>
                </li>
              )}

              {status === 'authenticated' && (
                <>
                  <li className="nav-item">
                    <Link href="/challenges/create">
                      <a
                        className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                          isActive('/challenges/create') ? 'border-b-2 border-white' : 'border-0'
                        }`}
                      >
                        <MdOutlineCreate className="text-lg leading-lg text-white opacity-75" />
                        <span className="ml-2">Create Challenge</span>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile">
                      <a
                        className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                          isActive('/profile') ? 'border-b-2 border-white' : 'border-0'
                        }`}
                      >
                        <CgProfile className="text-lg leading-lg text-white opacity-75" />
                        <span className="ml-2">{session.user.name}</span>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <>
                      <button
                        onClick={() => signOut({ redirect: false })}
                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 border-0"
                      >
                        <FiLogOut className="text-lg leading-lg text-white opacity-75" />
                        <span className="ml-2">Logout</span>
                      </button>
                    </>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar
