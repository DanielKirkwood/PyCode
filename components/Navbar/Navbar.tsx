import Link from 'next/link'
import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import NavDesktop from './NavDesktop'
import NavMobile from './NavMobile'

type Props = {
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

function Navbar({ status }: Props): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="text-white body-font bg-blue-500 font-display">
      <div className=" flex p-5 items-center px-10">
        <Link href="/">
          <a className="title-font font-medium text-xl justify-center align-middle">PyCode</a>
        </Link>
        <NavDesktop status={status} />
        <button
          type="button"
          aria-label="toggle mobile menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded md:hidden focus:outline-none focus:ring focus:ring-white focus:ring-opacity-50 text-xl cursor-pointer ml-auto items-center justify-center"
        >
          <FaBars />
        </button>
      </div>
      <div className="flex flex-col items-center px-10 bg-blue-500">{menuOpen && <NavMobile status={status} />}</div>
    </header>
  )
}

export default Navbar
