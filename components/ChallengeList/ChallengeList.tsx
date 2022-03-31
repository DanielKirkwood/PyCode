import ChallengeCard from '@/components/ChallengeCard/ChallengeCard'
import React from 'react'

interface Challenge {
  _id: number
  title: string
  description: string
  verified: boolean
}

interface Props {
  data: Challenge[]
}

const ChallengeList = ({ data }: Props) => {
  return (
    <div className="py-8 w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full">
        {data.map((challenge: Challenge) => (
          <ChallengeCard
            id={challenge._id}
            title={challenge.title}
            description={challenge.description}
            verified={challenge.verified}
            key={challenge._id}
          />
        ))}
      </div>
    </div>
  )
}

export default ChallengeList
