import Table from '@/components/Table/Table'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Admin: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session, status } = useSession()

  return (
    <div className="pt-24 w-full">
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
        <>
          <h1>Admin Dashboard</h1>
          <Table
            dataSource="/api/users?"
            dataKey="users"
            exclude={['password', 'nameSearch', 'image', 'emailVerified']}
            protectedKeys={['_id']}
            formDataObject={{
              name: 'string',
              email: 'string',
              role: 'string',
            }}
          />
        </>
      )}
    </div>
  )
}

export default Admin
