import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
// import useWindowSize from 'lib/helpers/useWindowSize'
import CodeEditor from '@/components/CodeEditor'
import { CommentList } from '@/components/CommentList'
import { useSession } from 'next-auth/react'

const ChallengePage: NextPage = () => {
  // const size = useWindowSize()
  const router = useRouter()
  const { id } = router.query

  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/challenges/${id}`, fetcher)

  const { data: session } = useSession()

  return (
    <div className="py-8 w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full">
        {error && <h1>Failed to load</h1>}
        {!data && <h1>Loading...</h1>}
        {data && (
          <>
            <h1 className="text-center text-2xl">{data.challenge.title}</h1>
            <div className="grid grid-cols-12 gap-2 sm:gap-5">
              <div className="text-center col-span-4 md:col-span-6 flex flex-col w-10/12">
                <div className="flex justify-between items-center mt-3">
                  <hr className="w-full" />
                  <span className="p-2 text-gray-400 mb-1">Description</span>
                  <hr className="w-full" />
                </div>
                <div>
                  <h3 className="text-lg">{data.challenge.description}</h3>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <hr className="w-full" />
                  <span className="p-2 text-gray-400 mb-1">Example</span>
                  <hr className="w-full" />
                </div>
                <div>
                  <h3 className="text-lg">Inputs:</h3>
                  {data.challenge.testCases[0].inputs.map((input, index) => {
                    return (
                      <h3 key={index} className="text-lg">
                        {input.inputName} = {input.inputValue}
                      </h3>
                    )
                  })}
                  <h3 className="text-lg">Output: {data.challenge.testCases[0].output}</h3>
                </div>
              </div>
              <div className="col-span-8 md:col-span-6">
                <CodeEditor title={data.challenge.title} testCases={data.challenge.testCases} challengeID={id} />
              </div>
            </div>
            {(session?.user.role === 'admin' ||
              session?.user.role === 'super-admin' ||
              data.challenge.owner === session?.user.id) && (
              <CommentList challengeID={id} isVerified={data.challenge.verified} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChallengePage
