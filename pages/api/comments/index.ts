import { postComment, deleteComment, editComment } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challengeComments = dbClient.db(process.env.MONGODB_DB).collection('challenge_comments')

  const { method } = req

  let text: string, challengeID: string, ownerID: string, commentID: string

  switch (method) {
    case 'POST':
      text = req.body.text
      challengeID = req.body.challengeID
      ownerID = req.body.ownerID

      if (!text) {
        res.status(500).json({ error: 'could not post challenge' })
        break
      }

      await postComment(challengeComments, challengeID.toString(), ownerID.toString(), text)

      res.status(200).json({ message: 'comment posted' })
      break
    case 'PATCH':
      text = req.body.text
      commentID = req.body.commentID

      if (!text) {
        res.status(500).json({ error: 'could not edit challenge' })
        break
      }

      const editedResult = await editComment(challengeComments, commentID.toString(), text)

      if (editedResult === null) {
        res.status(500).json({ error: 'could not edit challenge' })
        break
      }

      res.status(200).json({ message: 'comment edited successfully' })
      break
    case 'DELETE':
      commentID = req.body.commentID

      const deletedResult = await deleteComment(challengeComments, commentID.toString())

      if (deletedResult.error) {
        res.status(500).json({ error: 'error deleting comment' })
        break
      }

      res.status(200).json({ message: 'comment deleted' })
      break
    default:
      if (process.env.NODE_ENV === 'production') {
        dbClient.close()
      }
      res.setHeader('Allow', ['DELETE', 'POST', 'PATCH'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
