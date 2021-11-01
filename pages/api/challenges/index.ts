import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const limit = parseInt(req.query.limit as string, 10)
    const skip = parseInt(req.query.skip as string, 10)

    const dbClient = await clientPromise
    const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

    const result = await challenges.find({}).skip(skip).limit(limit).toArray()

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}
