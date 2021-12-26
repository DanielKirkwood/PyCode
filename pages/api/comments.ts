import { postComment, deleteComment, editComment, getAllComments } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challengeComments = dbClient.db(process.env.MONGODB_DB).collection('challenge_comments')

  const { method } = req
  interface Owner {
    ownerID: string
    ownerName: string
    ownerRole: string
  }
  let text: string, commentID: string, owner: Owner
  let challengeID: string | string[]

  switch (method) {
    case 'GET':
      challengeID = req.query.challengeID
      const allComments = await getAllComments(challengeComments, challengeID.toString())
      res.status(200).json({
        success: true,
        payload: {
          comments: allComments
        }
      })
      break
    case 'POST':
      text = req.body.text
      challengeID = req.body.challengeID
      owner = {
        ownerID: req.body.ownerID,
        ownerName: req.body.ownerName,
        ownerRole: req.body.ownerRole,
      }

      if (!text) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'Could not post comment.',
            },
          },
          error: {
            code: 500,
            message: 'Could not post comment.',
          },
        })
        break
      }

      await postComment(challengeComments, challengeID.toString(), text, owner)

      res.status(200).json({
        success: true,
        payload: {
          message: "Comment posted."
        }
      })
      break
    case 'PATCH':
      text = req.body.text
      commentID = req.body.commentID

      if (!text) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'No "text" field in body.',
            },
          },
          error: {
            code: 500,
            message: 'No "text" field in body.',
          },
        })
        break
      }

      const editedResult = await editComment(challengeComments, commentID, text)

      if (editedResult === null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'Could not edit comment.',
            },
          },
          error: {
            code: 500,
            message: 'Could not edit comment.',
          },
        })
        break
      }

      res.status(200).json({
        success: true,
        payload: {
          message: 'Comment edited successfully.'
        },

      })
      break
    case 'DELETE':
      commentID = req.body.commentID

      const deletedResult = await deleteComment(challengeComments, commentID.toString())

      if (deletedResult.error !== null) {
        res.status(500).json({
          success: false,
          payload: {
            error: {
              code: 500,
              message: 'Error deleting comment.',
            },
          },
          error: {
            code: 500,
            message: 'Error deleting comment.',
          },
        })
        break
      }

      res.status(200).json({
        success: true,
        payload: {
          message: 'Comment deleted.'
        }
      })
      break
    default:

      res.setHeader('Allow', ['DELETE', 'POST', 'PATCH', 'GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
