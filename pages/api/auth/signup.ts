import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/db/mongodb'
import { hashPassword } from 'lib/auth/auth'

const MONGODB_DB = process.env.MONGODB_DB
const NODE_ENV = process.env.NODE_ENV

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // only accept post request to this endpoint
  if (req.method !== 'POST') {
    res.status(500).json({ message: 'Route not valid' })
    return
  }

  // validation phase
  const { name, email, password, confirmPassword } = req.body
  const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  if (!name || !email || !password || !confirmPassword) {
    res.status(422).json({ message: 'Invalid data' })
    return
  }

  if (!validEmail.test(email)) {
    res.status(422).json({ message: 'Email is not valid' })
    return
  }

  if (password !== confirmPassword) {
    res.status(422).json({ message: 'Passwords do not match' })
    return
  }

  // connect with database
  const dbClient = await clientPromise
  const db = dbClient.db(MONGODB_DB)

  const checkExisting = await db.collection('users').findOne({ email: email })

  if (checkExisting) {
    res.status(422).json({ message: `User with email: ${email} already exists` })
    if (NODE_ENV !== 'development') {
      dbClient.close()
    }
    return
  }

  const status = await db.collection('users').insertOne({
    name,
    email,
    password: await hashPassword(password),
    image: '/public/default_user.png',
    emailVerified: null,
    role: 'user',
  })

  res.status(201).json({ message: 'User created', ...status })
  if (NODE_ENV !== 'development') {
    dbClient.close()
  }
}

export default handler
