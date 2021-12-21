// middleware.db.ts
// attaches database and client to request object

import clientPromise from 'lib/db/mongodb'

const MONGODB_DB = process.env.MONGODB_DB

export default async function database(req, res, next) {
  const dbClient = await clientPromise
  const db = dbClient.db(MONGODB_DB)
  req.db = db
  req.dbClient = dbClient

  next()
}
