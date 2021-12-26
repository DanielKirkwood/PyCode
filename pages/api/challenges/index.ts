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
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'There was a problem fetching challenges.',
            },
          },
          error: {
            code: 500,
            message: 'There was a problem fetching challenges.',
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          challenges: documents,
        },
      })
      break
    case 'POST':
      const challengeData = {
        title: req.body.title,
        description: req.body.description,
        testCases: req.body.testCases,
      }
      const documentID = await insertOne(challenges, req.body.owner, challengeData)

      if (documentID === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'There was a problem inserting challenge.',
            },
          },
          error: {
            code: 500,
            message: 'There was a problem inserting challenge.',
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          message: `Successfully added challenge ${documentID}.`,
          insertID: documentID,
        },
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
