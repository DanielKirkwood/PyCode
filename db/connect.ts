// db/connect.ts
// attempts to cache the mongodb connection in nodejs global scope

import { Db, MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local')
}

global.mongo = global.mongo || {}

export const connectToDatabase = async () => {
  // no mongodb connection - create a new one
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI, {
      connectTimeoutMS: 10000,
    })

    console.log('connecting to DB')
    await global.mongo.client.connect()
    console.log('connected to DB')
  }

  // get the specific databases
  const db: Db = global.mongo.client.db(MONGODB_DB)

  return { db, dbClient: global.mongo.client }
}
