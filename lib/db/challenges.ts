import { Collection, ObjectId } from 'mongodb'

interface TestCase {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
}
interface challengeData {
  title: string
  description: string
  testCases: TestCase[]
}

interface Owner {
  ownerID: string
  ownerName: string
  ownerRole: string
}

export const getAll = async (challenges: Collection, query = {}, limit = 50, skip = 0) => {
  try {
    const result = await challenges.find(query).skip(skip).limit(limit).toArray()
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

export const insertOne = async (challenges: Collection, ownerID: string, challengeData: challengeData) => {
  try {
    const result = await challenges.insertOne({
      ...challengeData,
      owner: ObjectId.createFromHexString(ownerID),
      verified: false,
      createdAt: new Date().toDateString(),
    })
    return result.insertedId
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateOne = async (challenges: Collection, challengeID: string, challengeData: challengeData) => {
  try {
    if (!ObjectId.isValid(challengeID)) {
      return { error: `Invalid challenge id: ${challengeID}` }
    }

    await challenges.updateOne(
      {
        _id: ObjectId.createFromHexString(challengeID),
      },
      {
        $set: {
          ...challengeData,
        },
      }
    )
    return true
  } catch (error) {
    console.error()
    return null
  }
}

export const deleteOne = async (challenges: Collection, id: string) => {
  try {
    const result = await challenges.deleteOne({ _id: ObjectId.createFromHexString(id) })
    return result.deletedCount
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const verifyChallenge = async (
  challenges: Collection,
  challengeID: string,
  verifiedBy: string,
  isVerified: boolean
) => {
  try {
    if (!ObjectId.isValid(verifiedBy)) {
      return null
    }

    if (!ObjectId.isValid(challengeID)) {
      return null
    }

    const result = await challenges.updateOne(
      {
        _id: ObjectId.createFromHexString(challengeID),
      },
      {
        $set: {
          verified: isVerified,
          verifiedBy: ObjectId.createFromHexString(verifiedBy),
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
