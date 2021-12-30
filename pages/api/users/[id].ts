import clientPromise from 'lib/db/mongodb'
import { getUser, updateUser } from 'lib/db/users'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const users = dbClient.db(process.env.MONGODB_DB).collection('users')

  const {
    query: { id },
    method,
  } = req
  switch (method) {
    case 'GET':
      const document = await getUser(users, id.toString())
      if (document === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: `Could not get user with id ${id}.`,
            },
          },
          error: {
            code: 500,
            message: `Could not get user with id ${id}.`,
          },
        })
        break
      }

      res.status(200).json({
        success: true,
        payload: {
          message: `User with id ${id} retrieved successfully.`,
          user: document,
        },
      })
      break
    case 'PATCH':
      const userFieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      }
      const updatedUser = await updateUser(users, id.toString(), userFieldsToUpdate)

      if (updatedUser === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: `Could not update user with id ${id}.`,
            },
          },
          error: {
            code: 500,
            message: `Could not update user with id ${id}.`,
          },
        })
        break
      }

      res.status(200).json({
        success: true,
        payload: {
          message: `User with id ${id} updated successfully.`,
          updatedUser: updatedUser,
        },
      })
      break
    case 'DELETE':
      break
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
