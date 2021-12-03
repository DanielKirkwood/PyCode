import { ObjectId } from 'mongodb'
import { Collection } from 'mongodb'

export const getAllSaved = async (userChallengeData: Collection, userID: string, limit = 50, skip = 0) => {
  try {
    const result = await userChallengeData
      .find({ user: ObjectId.createFromHexString(userID) })
      .skip(skip)
      .limit(limit)
      .toArray()
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getSaved = async (userChallengeData: Collection, userID: string, challengeID: string) => {
  try {
    if (!ObjectId.isValid(userID) || !ObjectId.isValid(challengeID)) {
      return { error: 'either user id or challenge id is invalid' }
    }
    const result = await userChallengeData.findOne({
      user: ObjectId.createFromHexString(userID),
      challenge: ObjectId.createFromHexString(challengeID),
    })

    if (!result) {
      return null
    }

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const SaveOne = async (userChallengeData: Collection, userID: string, challengeID: string, code: string) => {
  try {
    const result = await userChallengeData.updateOne(
      {
        user: ObjectId.createFromHexString(userID),
        challenge: ObjectId.createFromHexString(challengeID),
      },
      {
        $set: {
          user: ObjectId.createFromHexString(userID),
          challenge: ObjectId.createFromHexString(challengeID),
          code: code,
        },
      },
      { upsert: true }
    )

    if (result.modifiedCount === 1) {
      return 1
    }

    return null
  } catch (error) {
    console.error(error)
    return null
  }
}
