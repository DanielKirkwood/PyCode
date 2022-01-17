import React from 'react'
import Link from 'next/link'

interface Props {
  id: number
  title: string
  description: string
}

const ChallengeCard = (props: Props) => {
  return (
    <div className=" mb-7 bg-white p-6 shadow rounded">
      <div className="flex items-center border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between w-full">
          <div className="pl-3 w-full">
            <p className="text-xl font-medium leading-5 text-gray-800">{props.title}</p>
          </div>
        </div>
      </div>
      <div className="px-2">
        <p className="text-sm leading-5 py-4 text-gray-600">{props.description}</p>
        <Link href={`/challenges/${props.id}`}>
          <a className="py-2 px-4 text-xs leading-3 text-green-700 rounded-full bg-green-100">Try Challenge</a>
        </Link>
      </div>
    </div>
  )
}

export default ChallengeCard
