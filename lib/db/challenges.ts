import { ObjectId } from 'mongodb'
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

export const getOne = async (challenges: Collection, id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { error: `Invalid id: ${id}` }
    }
    const result = await challenges.findOne({ _id: ObjectId.createFromHexString(id) })
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getAllComments = async (challengeComments: Collection, challengeID: string) => {
  try {
    if (!ObjectId.isValid(challengeID)) {
      return { error: `Invalid challenge id: ${challengeID}` }
    }
    const result = challengeComments.find({ challenge: ObjectId.createFromHexString(challengeID) })
    return result
  } catch (error) {
    console.error(error)
  }
}

export const insertOne = async (challenges: Collection, data: challengeData) => {
  try {
    const result = await challenges.insertOne({
      ...data,
      verified: false,
      createdAt: new Date().toDateString(),
    })
    return result.insertedId
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteOne = async (challenges: Collection, id) => {
  try {
    const result = await challenges.deleteOne({ _id: ObjectId.createFromHexString(id) })
    return result.deletedCount
  } catch (error) {
    console.error(error)
    return 0
  }
}
