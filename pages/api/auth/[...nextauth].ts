import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { verifyPassword } from 'lib/auth/auth'
import clientPromise from 'lib/db/mongodb'
import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const MONGODB_DB = process.env.MONGODB_DB
const NODE_ENV = process.env.NODE_ENV

const getUser = async (email: string) => {
  const dbClient = await clientPromise
  const users = dbClient.db(process.env.MONGODB_DB).collection('users')
  try {
    const result = await users.findOne({
      email: email,
    })
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

const authHandler: NextApiHandler = async (req, res) =>
  NextAuth(req, res, {
    debug: NODE_ENV === 'development',
    useSecureCookies: NODE_ENV !== 'development',
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
      secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
    adapter: MongoDBAdapter({
      db: (await clientPromise).db(MONGODB_DB),
    }),
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        profile(profile) {
          return {
            id: profile.id,
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
            role: 'user',
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: 'user',
          }
        },
      }),
      CredentialsProvider({
        id: 'credentials',
        name: 'credentials',
        credentials: {
          email: { label: 'email', type: 'text', placeholder: 'Email' },
          password: { label: 'password', type: 'password', placeholder: 'password' },
        },
        async authorize(credentials) {
          const dbClient = await clientPromise
          const db = dbClient.db(MONGODB_DB)

          const user = await db.collection('users').findOne({ email: credentials.email })

          console.log(user)

          if (!user) {
            console.error('no user with that email')

            return null
          }

          const checkPassword = await verifyPassword(credentials.password, user.password)

          if (!checkPassword) {
            console.error("Password doesn't match")
            return null
          }

          if (user && checkPassword) {
            return { email: user.email, name: user.name, image: user.image, role: user.role }
          }
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        // first time jwt callback is run, user object is available
        if (user) {
          token.id = user.id
        }
        return token
      },
      session: async ({ session, token }) => {
        if (token) {
          const data = await getUser(session.user.email)

          session.user = {
            id: data._id,
            name: data.name,
            email: data.email,
            image: data.image,
            role: data.role,
          }
        }

        return session
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  })
export default authHandler
