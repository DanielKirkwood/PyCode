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
    res.status(500).json({
      success: false,
      payload: {
        error: {
          code: 500,
          message: 'UserID or ChallengeID not provided.',
        },
      },
      error: {
        code: 500,
        message: 'UserID or ChallengeID not provided.',
      },
    })
    return
  }
  const userID = slug[0]
  const challengeID = slug[1]

  switch (method) {
    case 'GET':
      const document = await getSaved(userChallengeData, userID.toString(), challengeID.toString())
      if (document === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: "Could not get saved document. Either it doesn't exist for the user or there was an error.",
            },
          },
          error: {
            code: 500,
            message: "Could not get saved document. Either it doesn't exist for the user or there was an error.",
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          document,
        },
      })
      break
    case 'PATCH':
      const result = await SaveOne(userChallengeData, userID.toString(), challengeID.toString(), req.body.code)

      if (result === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'Could not save.',
            },
          },
          error: {
            code: 500,
            message: 'Could not save.',
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          message: `challenge with id ${challengeID.toString} successfully saved`,
        },
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
