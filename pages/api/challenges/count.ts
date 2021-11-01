import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let query = {}

    if (!req.query.query) {
      query = req.query.query
    }

    const dbClient = await clientPromise
    const db = dbClient.db(process.env.MONGODB_DB)

    const count = await db.collection('challenges').countDocuments(query)

    return res.status(200).json(count)
  } catch (error) {
    return res.status(500).json(error)
  }
}
