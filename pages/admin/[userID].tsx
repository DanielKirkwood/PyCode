import Table from '@/components/Table'
import clientPromise from 'lib/db/mongodb'
import { getUser } from 'lib/db/users'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

interface Props {
  user: {
    _id: string
    name: string
    email: string
    password: string
    image: string
    emailVerified: boolean
    role: string
    nameSearch: string[]
  }
}

const UserAdmin: NextPage<Props> = ({ user }) => {
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
            dataSource={`/api/challenges?user=${user._id}`}
            dataKey="challenges"
            exclude={['testCases', 'verifiedBy', 'createdAt']}
            protectedKeys={['_id', 'owner']}
            formDataObject={{
              title: 'string',
              description: 'string',
              verified: 'boolean',
            }}
          />
        </>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get challenge data from database
  // this function will be called server-side and therefore will not be exposed to client
  const dbClient = await clientPromise
  const usersCollection = dbClient.db(process.env.MONGODB_DB).collection('users')

  const document = await getUser(usersCollection, context.params.userID.toString())
  const user = JSON.parse(JSON.stringify(document))

  if (user.error) {
    return {
      props: {},
    }
  }

  return {
    props: {
      user,
    },
  }
}

export default UserAdmin
