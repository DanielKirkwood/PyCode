import { Collection } from 'mongodb'

interface challengeData {
  title: string
  description: string
  input: string
  output: string
}

export const getAll = async (challenges: Collection, limit = 50, skip = 0) => {
  try {
    const result = await challenges.find({}).skip(skip).limit(limit).toArray()
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const insertOne = async (challenges: Collection, data: challengeData) => {
  try {
    const result = await challenges.insertOne({
      ...data,
      createdAt: new Date().toDateString(),
    })
    return result.insertedId
  } catch (error) {
    console.error(error)
    return null
  }
}
