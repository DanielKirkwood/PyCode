// middleware.db.ts
// attaches databse and client to request object

import { connectToDatabase } from '../db/connect'

export default async function database(req, res, next) {
  const { db, dbClient } = await connectToDatabase()
  req.db = db
  req.dbClinet = dbClient

  next()
}
