import { useSession } from 'next-auth/react'
import Footer from './Footer'
import Navbar from './Navbar/Navbar'

export default function Layout({ children }) {
  const { status } = useSession()
  return (
    <>
      <Navbar status={status} />
      <main className="min-h-screen">{children}</main>
      <Footer status={status} />
    </>
  )
}
