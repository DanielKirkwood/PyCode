import type { NextPage } from 'next'
import ChallengeList from '@/components/ChallengeList'
import { useState } from 'react'
import useSWR from 'swr'
import Pagination from '@/components/Pagination'

const Challenges: NextPage = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR('/api/challenges/count', fetcher)

  const LIMIT = 5
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(0)

  const goToPage = (i) => {
    setSkip(i * LIMIT)
    setPage(i)
  }

  return (
    <>
      <ChallengeList limit={LIMIT} skip={skip} />
      {error && <h1>Failed to load</h1>}
      {!data && <h1>Loading..</h1>}
      {data && <Pagination totalPages={data.payload.count / LIMIT} currentPage={page} pageClick={goToPage} />}
    </>
  )
}


export default Challenges
