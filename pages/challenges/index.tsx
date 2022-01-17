import ChallengeList from '@/components/ChallengeList/ChallengeList'
import Pagination from '@/components/Pagination'
import SkeletonChallengeList from '@/components/SkeletonChallengeList'
import type { NextPage } from 'next'
import { useState } from 'react'
import useSWR from 'swr'

const Challenges: NextPage = () => {
  const [limit] = useState<number>(20)
  const [skip, setSkip] = useState<number>(0)

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(`/api/challenges?limit=${limit}&skip=${skip}`, fetcher)

  function onSkipBtnClick(n: number): void {
    setSkip(n)
  }

  return (
    <>
      {error && <h1>Failed to load</h1>}
      {!data && <SkeletonChallengeList numChallenges={limit} />}
      {data && (
        <>
          <ChallengeList data={data.payload.challenges} />
          <Pagination
            limit={limit}
            skip={skip}
            onSkipBtnClick={onSkipBtnClick}
            numRows={data.payload.numDocuments}
            numRowsRemaining={data.payload.numDocumentsRemaining}
            totalRows={data.payload.totalDocuments}
          />
        </>
      )}
    </>
  )
}

export default Challenges
