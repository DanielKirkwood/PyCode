import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from 'lib/db/mongodb'
import { verifyPassword } from 'lib/auth/auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const MONGODB_DB = process.env.MONGODB_DB
const NODE_ENV = process.env.NODE_ENV

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

          if (!user) {
            if (NODE_ENV !== 'development') {
              dbClient.close()
            }
            console.error('No User with that email')
            return null
          }

          const checkPassword = await verifyPassword(credentials.password, user.password)

          if (!checkPassword) {
            if (NODE_ENV !== 'development') {
              dbClient.close()
            }
            console.error("Password doesn't match")
            return null
          }

          if (NODE_ENV !== 'development') {
            dbClient.close()
          }

          return { email: user.email, name: user.name, image: user.image, role: user.role }
        },
      }),
    ],
    callbacks: {
      jwt: ({ token, user }) => {
        // first time jwt callback is run, user object is available
        if (user) {
          token.id = user.id
        }
        return token
      },
      session: ({ session, token }) => {
        if (token) {
          session.id = token.id
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
