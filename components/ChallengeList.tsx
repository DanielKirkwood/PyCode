import React from 'react'
import ChallengeCard from '@/components/ChallengeCard'
import useSWR from 'swr'
import SkeletonChallengeList from './SkeletonChallengeList'

interface Challenge {
  _id: number
  title: string
  description: string
}

interface Props {
  limit: number
  skip: number
}

const ChallengeList = ({ limit, skip }: Props) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/challenges?limit=${limit}&skip=${skip}`, fetcher)

  return (
    <div className="py-8 w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full">
        {error && <h1>Failed to load</h1>}
        {!data && <SkeletonChallengeList numChallenges={limit} />}
        {data &&
          data.payload.challenges.map((challenge: Challenge) => (
            <ChallengeCard
              id={challenge._id}
              title={challenge.title}
              description={challenge.description}
              key={challenge._id}
            />
          ))}
      </div>
    </div>
  )
}

export default ChallengeList
