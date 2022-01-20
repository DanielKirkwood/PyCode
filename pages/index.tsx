import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import heroImage from '../public/hero-code.png'

const Home: NextPage = () => {
  const { status } = useSession()
  const loading = status === 'loading'

  if (typeof window !== 'undefined' && loading) return null

  return (
    <section className="text-gray-600">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:w-1/2 px-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <div>
            <p className="uppercase tracking-wide w-full">PyCode</p>
            <h1 className="sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Develop Your Python Skills</h1>
            <p className="mb-8 leading-relaxed">Challenge yourself and others python coding ability</p>
          </div>
          <div className="flex flex-wrap justify-center ">
            <Link href={status === 'unauthenticated' ? '/login' : '/challenges/create'}>
              <a
                data-testid="call-to-action"
                className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 mb-2 focus:outline-none hover:bg-blue-600 rounded text-lg"
              >
                {status === 'unauthenticated' ? 'Log in' : 'Create Challenge'}
              </a>
            </Link>
            <Link href="/challenges">
              <a className="md:ml-4 ml-4 mb-2 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Challenges
              </a>
            </Link>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <Image className="object-cover object-center rounded" alt="hero" src={heroImage} />
        </div>
      </div>
    </section>
  )
}

export default Home
