import { deleteOne, getAllComments, getOne, postComment } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')
  const challengeComments = dbClient.db(process.env.MONGODB_DB).collection('challenge_comments')

  const {
    query: { id, comments },
    method,
  } = req
  switch (method) {
    case 'GET':
      const document = await getOne(challenges, id.toString())
      if (document === null) {
        res.status(500).json({ error: `could not get challenge with id ${id}` })
        break
      }

      if (comments === 'true') {
        // fetch comments
        const allComments = await getAllComments(challengeComments, id.toString())
        res.status(200).json({ challenge: document, comments: allComments })
        break
      } else {
        res.status(200).json({ challenge: document, comments: null })
        break
      }
    case 'POST':
      const {
        body: { text, owner },
      } = req
      if (!text) {
        res.status(500).json({ error: 'could not post challenge' })
        break
      }

      await postComment(challengeComments, id.toString(), owner.toString(), text)

      res.status(200).json({ message: 'comment posted' })
      break
    case 'DELETE':
      const result = await deleteOne(challenges, id.toString())
      if (result === 0) {
        res.status(500).json({ error: `could not delete challenge with id ${id}` })
        break
      }
      res.status(200).json({ message: `challenge with id ${id.toString} successfully deleted` })
      break
    default:
      if (process.env.NODE_ENV === 'production') {
        dbClient.close()
      }
      res.setHeader('Allow', ['GET', 'DELETE', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
