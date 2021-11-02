import React from 'react'

interface Props {
  numChallenges: number
}

const SkeletonChallengeList = ({ numChallenges }: Props) => {
  const pages = []
  for (let index = 0; index < numChallenges; index++) {
    pages.push(
      <div key={index} className="animate-pulse mb-7 bg-white p-6 shadow rounded">
        <div className="flex items-center border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between w-full">
            <div className="pl-3 w-1/3 h-5 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
        <div className="px-2 py-5">
          <div className="bg-gray-300 my-2 w-1/2 h-5 rounded-md"></div>
          <div className="bg-gray-300 my-2 w-1/2 h-5 rounded-md"></div>
          <div className="bg-gray-300 my-2 w-1/3 h-5 rounded-md"></div>
          <div className="bg-gray-300 my-2 w-1/4 h-5 rounded-md"></div>
          <div className="w-1/6 mt-10 h-5 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    )
  }

  return <>{pages}</>
}

export default SkeletonChallengeList
