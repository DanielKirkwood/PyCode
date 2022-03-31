import { getAll, insertOne } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

  const { method } = req
  switch (method) {
    case 'GET':
      const limit = !req.query.limit ? 50 : parseInt(req.query.limit as string, 10)
      const skip = !req.query.skip ? 0 : parseInt(req.query.skip as string, 10)
      const query = {}
      if (!req.query.admin) {
        query['verified'] = true
      }
      if (req.query.user) {
        query['owner'] = ObjectId.createFromHexString(req.query.user.toString())
      }
      if (req.query.search) {
        query['title'] = { $regex: `${String(req.query.search)}`, $options: 'i' }
      }

      const documents = await getAll(challenges, query, limit, skip)

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

      const numDocuments = documents.length
      const totalDocuments = await challenges.countDocuments(query)
      const numDocumentsRemaining = (await challenges.countDocuments(query, { skip: skip })) - limit

      res.status(200).json({
        success: true,
        payload: {
          challenges: documents,
          numDocuments,
          totalDocuments,
          numDocumentsRemaining,
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
