import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { useSession } from 'next-auth/react'

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
