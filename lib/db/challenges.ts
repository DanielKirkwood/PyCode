import { ObjectId } from 'mongodb'
import { Collection } from 'mongodb'

interface challengeData {
  title: string
  description: string
  input: string
  output: string
}

interface Owner {
  ownerID: string
  ownerName: string
  ownerRole: string
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

    const cursor = challengeComments.find({ challenge: ObjectId.createFromHexString(challengeID) })
    const allComments = await cursor.toArray()

    return allComments
  } catch (error) {
    console.error(error)
  }
}

export const postComment = async (challengeComments: Collection, challengeID: string, text: string, owner: Owner) => {
  try {
    if (!ObjectId.isValid(challengeID)) {
      return { error: `Invalid challenge id: ${challengeID}` }
    }
    if (!ObjectId.isValid(owner.ownerID)) {
      return { error: `Invalid owner id: ${owner.ownerID}` }
    }

    const today = new Date()
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

    const result = await challengeComments.insertOne({
      ownerID: ObjectId.createFromHexString(owner.ownerID),
      ownerName: owner.ownerName,
      ownerRole: owner.ownerRole,
      challenge: ObjectId.createFromHexString(challengeID),
      body: text,
      createdAt: date + ' ' + time,
    })

    return result
  } catch (error) {
    console.error(error)
  }
}

export const editComment = async (challengeComments: Collection, commentID: string, text: string) => {
  try {
    if (!ObjectId.isValid(commentID)) {
      return { error: `Invalid comment id: ${commentID}` }
    }

    const result = await challengeComments.updateOne(
      {
        _id: ObjectId.createFromHexString(commentID),
      },
      {
        $set: {
          body: text,
        },
      }
    )

    if (result.modifiedCount === 1) {
      return 1
    }

    return null
  } catch (error) {
    console.error(error)
  }
}

export const deleteComment = async (challengeComments: Collection, commentID: string) => {
  try {
    if (!ObjectId.isValid(commentID)) {
      return { error: `Invalid comment id: ${commentID}` }
    }

    const result = await challengeComments.deleteOne({
      _id: ObjectId.createFromHexString(commentID),
    })

    if (result.deletedCount === 1) {
      return { error: null }
    }
    return { error: 'comment could not be deleted' }
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
