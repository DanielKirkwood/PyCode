import type { NextPage } from 'next'
import heroCode from '../public/hero-code.png'
import Link from 'next/link'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className="pt-24">
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
          <p className="uppercase tracking-wide w-full">PyCode</p>
          <h1 className="my-4 text-5xl font-bold leading-tight">Develop Your Python Skills</h1>
          <p className="leading-normal text-2xl mb-6">Challenge yourself and others python coding ability</p>
          <Link href="/">
            <a
              className="md:mx-0 mx-auto hover:underline hover:text-white bg-blue-400 text-white
             font-bold rounded-lg my-3 py-2 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              Sign-Up
            </a>
          </Link>
        </div>
        <div className="flex flex-col w-full md:w-1/2 justify-center justify-items-center ml-10">
          <Image src={heroCode} alt="screenshot of python code" />
        </div>
      </div>
    </div>
  )
}

export default Home
