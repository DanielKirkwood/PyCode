import ChallengeList from '@/components/ChallengeList/ChallengeList'
import Pagination from '@/components/Pagination/Pagination'
import SkeletonChallengeList from '@/components/SkeletonChallengeList'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR from 'swr'

const Challenges: NextPage = () => {
  const { data: session } = useSession()
  let isAdmin = false
  if (session?.user.role === 'admin' || session?.user.role === 'super-admin') {
    isAdmin = true
  }

  const [limit] = useState<number>(20)
  const [skip, setSkip] = useState<number>(0)

  const fetcher = (url) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR(
    isAdmin ? `/api/challenges?admin=true&limit=${limit}&skip=${skip}` : `/api/challenges?limit=${limit}&skip=${skip}`,
    fetcher
  )

  function onSkipBtnClick(n: number): void {
    setSkip(n)
  }

  return (
    <section>
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
    </section>
  )
}

export default Challenges
