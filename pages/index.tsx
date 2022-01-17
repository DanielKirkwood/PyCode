import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Home: NextPage = () => {
  const { status } = useSession()
  const loading = status === 'loading'

  if (typeof window !== 'undefined' && loading) return null

  return (
    <div className="pt-24">
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
          <p className="uppercase tracking-wide w-full">PyCode</p>
          <h1 className="my-4 text-5xl font-bold leading-tight">Develop Your Python Skills</h1>
          <p className="leading-normal text-2xl mb-6">Challenge yourself and others python coding ability</p>
          <div className="flex flex-col items-center justify-center align-middle sm:justify-start sm:flex-row flex-wrap mx-auto w-full">
            <Link href="/challenges">
              <a
                className="mr-2 hover:underline hover:text-white bg-blue-400 border-2 border-blue-400 text-white
               font-bold rounded-lg my-3 py-2 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Challenges
              </a>
            </Link>
            {status === 'unauthenticated' && (
              <Link href="/login">
                <a
                  data-testid="call to action"
                  className="hover:underline border-blue-400 border-2 text-black
               font-bold rounded-lg my-3 py-2 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  Login
                </a>
              </Link>
            )}
            {status === 'authenticated' && (
              <Link href="/challenges/create">
                <a
                  data-testid="call to action"
                  className="hover:underline border-blue-400 border-2 text-black
               font-bold rounded-lg my-3 py-2 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  Create a challenge
                </a>
              </Link>
            )}
          </div>
        </div>
        {/* <div className="flex flex-col w-full md:w-1/2 justify-center justify-items-center ml-10">
          <Image src={heroCode} alt="screenshot of python code" />
        </div> */}
      </div>
    </div>
  )
}

export default Home
