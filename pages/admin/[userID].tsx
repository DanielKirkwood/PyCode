import Table from '@/components/Table'
import clientPromise from 'lib/db/mongodb'
import { getUser } from 'lib/db/users'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'

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
  const loading = status === 'loading'

  // if (typeof window !== 'undefined' && loading) return null

  const [limit, setLimit] = useState(Number(20))
  const [skip, setSkip] = useState(Number(0))

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())
  const { data, error, mutate } = useSWR(`/api/challenges?user=${user._id}&limit=${limit}&skip=${skip}`, fetcher)

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
          <section className="text-gray-600 body-font w-full">
            <div className="container flex flex-wrap px-5 py-24 mx-auto items-center">
              <div className="md:w-1/4 md:pr-12 md:py-8 md:border-r md:border-b-0 mb-10 md:mb-0 pb-10 border-b border-gray-200">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                  {user.name}{' '}
                  <span className="px-4 py-1  rounded-full bg-green-100 text-green-800  font-semibold text-sm">
                    {user.role}
                  </span>
                </h1>
                <p className="leading-relaxed text-base">{user.email}</p>
              </div>
              <div className="flex flex-col md:w-3/4 md:pl-12">
                <h2 className="title-font font-semibold text-gray-800 tracking-wider text-sm mb-3 uppercase">
                  Challenges
                </h2>
                <div className="block w-full overflow-x-auto">
                  <Table editable headings={['id', 'name', 'email', 'role']}>
                    <Table.Row data={{ _id: '1234', name: 'Daniel', email: 'user@email.com', role: 'super-admin' }} />
                    <Table.Row data={{ _id: '5678', name: 'John', email: 'user2@email.com', role: 'admin' }} />
                    <Table.Row data={{ _id: '1356', name: 'Dillon', email: 'user3@email.com', role: 'user' }} />
                  </Table>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
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
