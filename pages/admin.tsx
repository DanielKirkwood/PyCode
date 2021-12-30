import UserTable from '@/components/UserTable'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Admin: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  if (typeof window !== 'undefined' && loading) return null

  return (
    <div className="pt-24 w-full">
      <div className="container  mx-auto px-3 flex flex-wrap flex-col md:flex-row items-center">
        {status === 'unauthenticated' && (
          <div className="text-center">
            <p className="py-2 mb-4 text-center text-md tracking-wide text-red-600">
              You must be logged in to view the admin page
            </p>
            <Link href="/login">
              <a className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</a>
            </Link>
          </div>
        )}
        {status === 'authenticated' && session?.user.role !== 'super-admin' && (
          <div className="text-center">
            <p className="py-2 mb-4 text-center text-md tracking-wide text-red-600">
              Only users with the role of &quot;super-admin&quot; can view this page
            </p>
            <Link href="/challenges">
              <a className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Go to challenges page</a>
            </Link>
          </div>
        )}
        {status === 'authenticated' && session?.user.role === 'super-admin' && (
          <div className="">
            <h1>Admin Dashboard</h1>
            <UserTable />
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
