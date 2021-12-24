import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAll, insertOne } from 'lib/db/challenges'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

  const { method } = req
  switch (method) {
    case 'GET':
      const limit = !req.query.limit ? 50 : req.query.limit
      const skip = !req.query.skip ? 0 : req.query.skip

      const documents = await getAll(challenges, parseInt(limit as string, 10), parseInt(skip as string, 10))

      if (documents === null) {
        res.status(500).json({ error: 'error getting challenges ' })
      }
      res.status(200).json(documents)
      break
    case 'POST':
      const challengeData = {
        title: req.body.title,
        description: req.body.description,
        testCases: req.body.testCases,
      }
      const documentId = await insertOne(challenges, req.body.owner, challengeData)

      if (documentId === null) {
        res.status(500).json({ error: 'could not insert challenge' })
      }
      res.status(200).json({ message: `Successfully added challenge ${documentId}`, insertId: documentId })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
