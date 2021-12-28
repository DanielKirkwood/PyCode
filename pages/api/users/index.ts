import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllUsers } from 'lib/db/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const users = dbClient.db(process.env.MONGODB_DB).collection('users')

  const { method } = req
  switch (method) {
    case 'GET':
      const limit = !req.query.limit ? 50 : req.query.limit
      const skip = !req.query.skip ? 0 : req.query.skip

      const documents = await getAllUsers(users, parseInt(limit as string, 10), parseInt(skip as string, 10))

      if (documents === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'There was a problem fetching users.',
            },
          },
          error: {
            code: 500,
            message: 'There was a problem fetching users.',
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          users: documents,
        },
      })
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
