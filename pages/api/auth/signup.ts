import { hashPassword } from 'lib/auth/auth'
import clientPromise from 'lib/db/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

const MONGODB_DB = process.env.MONGODB_DB

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // only accept post request to this endpoint
  if (req.method !== 'POST') {
    res.status(500).json({
      success: false,
      payload: {
        error: {
          code: 500,
          message: 'Route not valid.',
        },
      },
      error: {
        code: 500,
        message: 'Route not valid.',
      },
    })
    return
  }

  // validation phase
  const { name, email, password, confirmPassword } = req.body
  const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  if (!name || !email || !password || !confirmPassword) {
    res.status(422).json({
      success: false,
      payload: {
        error: {
          code: 422,
          message: 'Not all data provided.',
        },
      },
      error: {
        code: 422,
        message: 'Not all data provided.',
      },
    })
    return
  }

  if (!validEmail.test(email)) {
    res.status(422).json({
      success: false,
      payload: {
        error: {
          code: 422,
          message: 'Email provided not valid.',
        },
      },
      error: {
        code: 422,
        message: 'Email provided not valid.',
      },
    })
    return
  }

  if (password !== confirmPassword) {
    res.status(422).json({
      success: false,
      payload: {
        error: {
          code: 422,
          message: 'Passwords do not match.',
        },
      },
      error: {
        code: 422,
        message: 'Passwords do not match.',
      },
    })
    return
  }

  // connect with database
  const dbClient = await clientPromise
  const db = dbClient.db(MONGODB_DB)

  const checkExisting = await db.collection('users').findOne({ email: email })

  if (checkExisting) {
    res.status(422).json({
      success: false,
      payload: {
        existingUser: checkExisting,
        error: {
          code: 422,
          message: `User with email: ${email} already exists.`,
        },
      },
      error: {
        code: 422,
        message: `User with email: ${email} already exists.`,
      },
    })
    return
  }

  const status = await db.collection('users').insertOne({
    name,
    email,
    password: await hashPassword(password),
    image: '/public/default_user.png',
    emailVerified: null,
    role: 'user',
    nameSearch: name.split(' '),
  })

  res.status(201).json({
    success: true,
    payload: {
      message: 'User Created',
      ...status,
    },
  })
}

export default handler
