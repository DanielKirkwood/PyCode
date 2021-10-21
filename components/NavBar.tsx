import React, { ReactElement, useState } from 'react'
import Link from 'next/link'
import { Menu } from 'antd'
import { CodeOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons'

function NavBar(): ReactElement {
  const [selected, setSelected] = useState('home')

  return (
    <Menu onClick={(e) => setSelected(e.key)} selectedKeys={[selected]} mode="horizontal">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link href="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="challenges" icon={<CodeOutlined />}>
        <Link href={'/challenges'}>Challenges</Link>
      </Menu.Item>
      <Menu.Item key="login" icon={<LoginOutlined />}>
        <Link href="/login">Login</Link>
      </Menu.Item>
    </Menu>
  )
}

export default NavBar
