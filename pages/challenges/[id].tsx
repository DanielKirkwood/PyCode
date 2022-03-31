import CodeEditor from '@/components/CodeEditor'
import { CommentList } from '@/components/Comment/CommentList'
import { getOne } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
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
    <section className="text-gray-600">
      <div className="container mx-auto flex px-5 pt-24 pb-6 lg:flex-row flex-col items-center">
        <div className="lg:flex-grow lg:pr-24 lg:w-1/2 flex flex-col lg:items-start lg:text-left mb-16 items-center text-center w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{challenge.title}</h1>
          <p className="mb-8 leading-relaxed">{challenge.description}</p>
          <div className="flex justify-between items-center mt-3">
            <hr className="w-full" />
            <span className="text-gray-400 mb-1">Example</span>
            <hr className="w-full" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Inputs:</h3>
            {challenge.testCases[0].inputs.map((input, index) => {
              return (
                <h3 key={index} className="text-lg">
                  {input.inputName} = {input.inputValue}
                </h3>
              )
            })}
            <h3 className="text-lg font-bold">
              Output: <span className="font-normal">{challenge.testCases[0].output}</span>
            </h3>
            {challenge.owner === session?.user.id && (
              <>
                <div className="flex justify-between items-center mt-3">
                  <hr className="w-full" />
                  <span className="p-2 text-gray-400 mb-1">Actions</span>
                  <hr className="w-full" />
                </div>
                <div>
                  <button
                    className="rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
                    onClick={() => router.push(`/challenges/edit/${challenge.id}`)}
                  >
                    Edit challenge
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="md:max-w-4xl w-full  ">
          <CodeEditor title={challenge.title} testCases={challenge.testCases} challengeID={challenge.id} />
        </div>
      </div>
      {(session?.user.role === 'admin' ||
        session?.user.role === 'super-admin' ||
        challenge.owner === session?.user.id) && (
        <CommentList challengeID={challenge.id} isVerified={challenge.verified} />
      )}
    </section>
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
