import { getSaved, SaveOne } from 'lib/db/users'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const userChallengeData = dbClient.db(process.env.MONGODB_DB).collection('user_challenge_data')

  const {
    query: { slug },
    method,
  } = req

  if (slug.length !== 2) {
    res.status(500).json({ error: 'userID or challengeID not provided' })
  }
  const userID = slug[0]
  const challengeID = slug[1]

  switch (method) {
    case 'GET':
      const document = await getSaved(userChallengeData, userID.toString(), challengeID.toString())
      if (document === null) {
        res.status(500).json({ error: `error getting saved document` })
        return
      }
      res.status(200).json(document)
      break
    case 'PATCH':

      const result = await SaveOne(userChallengeData, userID.toString(), challengeID.toString(), req.body.code)

      if (result === null) {
        res.status(500).json({ error: 'error saving' })
        return
      }
      res.status(200).json({ message: `challenge with id ${challengeID.toString} successfully saved` })
      break
    default:

      res.setHeader('Allow', ['GET', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
