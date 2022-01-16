import CodeEditor from '@/components/CodeEditor'
import { CommentList } from '@/components/CommentList'
import { getOne } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'

interface TestCase {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
}
interface challengeData {
  id: string
  title: string
  owner: string
  description: string
  verified: boolean
  testCases: TestCase[]
  createdAt: string
}

interface Props {
  challenge: challengeData
}

const ChallengePage: NextPage<Props> = ({ challenge }) => {
  const { data: session } = useSession()
  const router: NextRouter = useRouter()

  return (
    <div className="py-8 w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full">
        {!challenge && (
          <div className="text-center">
            <h1 className="text-2xl mb-6">
              There was an error getting this challenge. Ensure the url is correct or...
            </h1>
            <Link href="/challenges">
              <a
                className="px-6 py-2 mt-4  bg-blue-600 rounded-lg hover:bg-blue-900 hover:underline text-white
               font-bold my-3  shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Go to challenges page
              </a>
            </Link>
          </div>
        )}
        {challenge && (
          <>
            <h1 className="text-center text-2xl">{challenge.title}</h1>
            <div className="grid grid-cols-12 gap-2 sm:gap-5">
              <div className="text-center col-span-4 md:col-span-6 flex flex-col w-10/12">
                <div className="flex justify-between items-center mt-3">
                  <hr className="w-full" />
                  <span className="p-2 text-gray-400 mb-1">Description</span>
                  <hr className="w-full" />
                </div>
                <div>
                  <h3 className="text-lg">{challenge.description}</h3>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <hr className="w-full" />
                  <span className="p-2 text-gray-400 mb-1">Example</span>
                  <hr className="w-full" />
                </div>
                <div>
                  <h3 className="text-lg">Inputs:</h3>
                  {challenge.testCases[0].inputs.map((input, index) => {
                    return (
                      <h3 key={index} className="text-lg">
                        {input.inputName} = {input.inputValue}
                      </h3>
                    )
                  })}
                  <h3 className="text-lg">Output: {challenge.testCases[0].output}</h3>
                  {challenge.owner === session?.user.id && (
                    <>
                      <div className="flex justify-between items-center mt-3">
                        <hr className="w-full" />
                        <span className="p-2 text-gray-400 mb-1">Actions</span>
                        <hr className="w-full" />
                      </div>
                      <div>
                        <button
                          className="text-white bg-blue-500 border-0  py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
                          onClick={() => router.push(`/challenges/edit/${challenge.id}`)}
                        >
                          Edit challenge
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-8 md:col-span-6">
                <CodeEditor title={challenge.title} testCases={challenge.testCases} challengeID={challenge.id} />
              </div>
            </div>
            {(session?.user.role === 'admin' ||
              session?.user.role === 'super-admin' ||
              challenge.owner === session?.user.id) && (
              <CommentList challengeID={challenge.id} isVerified={challenge.verified} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get challenge data from database
  // this function will be called server-side and therefore will not be exposed to client
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

  const document = await getOne(challenges, context.params.id.toString())
  const challengeData = JSON.parse(JSON.stringify(document))

  if (challengeData.error) {
    return {
      props: {},
    }
  }

  return {
    props: {
      challenge: {
        id: challengeData._id,
        title: challengeData.title,
        description: challengeData.description,
        testCases: challengeData.testCases,
        owner: challengeData.owner,
        verified: challengeData.verified,
        createdAt: challengeData.createdAt,
      },
    },
  }
}

export default ChallengePage
