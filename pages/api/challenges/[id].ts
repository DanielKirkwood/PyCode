import { deleteOne, getOne, updateOne, verifyChallenge } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

  const {
    query: { id, verified },
    method,
  } = req
  switch (method) {
    case 'GET':
      const document = await getOne(challenges, id.toString())
      if (document === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: `Could not get challenge with id ${id}.`,
            },
          },
          error: {
            code: 500,
            message: `Could not get challenge with id ${id}.`,
          },
        })
        break
      }

      res.status(200).json({
        success: true,
        payload: {
          message: `Challenge with id ${id} retrieved successfully.`,
          challenge: document,
        },
      })
      break
    case 'PATCH':
      if (verified) {
        // verified query param provided

        const verifiedStatus = verified === 'true'

        const verifiedBy = req.body.verifiedBy

        const editedResult = await verifyChallenge(challenges, id.toString(), verifiedBy, verifiedStatus)

        if (editedResult === null) {
          res.status(500).json({
            success: false,
            payload: {
              error: {
                code: 500,
                message: 'Could not edit verified status.',
              },
            },
            error: {
              code: 500,
              message: 'Could not edit verified status.',
            },
          })
          break
        }

        res.status(200).json({
          success: true,
          payload: {
            message: 'Verified status edited successfully.',
          },
        })
        break
      }

      // verified query param not provided, so update the challenge
      const challengeData = req.body.challengeData

      const editedResult = await updateOne(challenges, id.toString(), challengeData)

      if (editedResult) {
        res.status(200).json({
          success: true,
          payload: {
            message: 'Challenge updated.',
          },
        })
        break
      }

      res.status(500).json({
        success: false,
        payload: {
          error: {
            code: 500,
            message: 'Issue updating challenge.',
          },
        },
        error: {
          code: 500,
          message: 'Issue updating challenge.',
        },
      })
      break
    case 'DELETE':
      const result = await deleteOne(challenges, id.toString())
      if (result === 0) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: `Could not delete challenge with id ${id}.`,
            },
          },
          error: {
            code: 500,
            message: `Could not delete challenge with id ${id}.`,
          },
        })
        break
      }
      res.status(200).json({
        success: true,
        payload: {
          message: `Challenge with id ${id.toString} successfully deleted.`,
        },
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
