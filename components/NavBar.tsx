import React, { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Menu } from 'antd'
import { FaCode, FaHome } from 'react-icons/fa'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { CgProfile } from 'react-icons/cg'

function NavBar(): ReactElement {
  const router = useRouter()
  const [selected, setSelected] = useState('home')

  const { data: session, status } = useSession()

  useEffect(() => {
    if (router.pathname === '/') {
      setSelected('home')
    } else if (router.pathname.startsWith('/challenges')) {
      setSelected('challenges')
    } else if (router.pathname === '/login' || router.pathname === '/signup') {
      setSelected('login')
    }
  }, [router])

  return (
    <Menu onClick={(e) => setSelected(e.key)} selectedKeys={[selected]} mode="horizontal">
      <Menu.Item key="home" icon={<FaHome />}>
        <Link href="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="challenges" icon={<FaCode />}>
        <Link href={'/challenges'}>Challenges</Link>
      </Menu.Item>

      {status === 'unauthenticated' && (
        <Menu.Item key="login" icon={<FiLogIn />}>
          <Link href="/login">Login</Link>
        </Menu.Item>
      )}

      {status === 'authenticated' && (
        <>
          <Menu.Item key="profile" icon={<CgProfile />}>
            <Link href="/profile">{session.user.name}</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<FiLogOut />}>
            <Link href="/logout">Logout</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  )
}

export default NavBar
