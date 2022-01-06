import clientPromise from 'lib/db/mongodb'
import { getUser } from 'lib/db/users'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { TiTick, TiTimes } from 'react-icons/ti'
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
                  <table className="items-center w-full bg-transparent border-collapse table-fixed">
                    <thead>
                      <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Challenge ID
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Title
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Description
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Verified
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {error && <h1>There was an error</h1>}
                      {!data && <h1>Loading user data</h1>}
                      {data &&
                        data.payload.challenges.map((challenge) => (
                          <tr key={challenge._id}>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                              {challenge._id}
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {`${challenge.title.substring(0, 20)}...`}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {`${challenge.description.substring(0, 25)}...`}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-md whitespace-nowrap p-4">
                              {challenge.verified ? (
                                <TiTick className="text-green-500" />
                              ) : (
                                <TiTimes className="text-red-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
