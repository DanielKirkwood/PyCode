import { Collection, ObjectId } from 'mongodb'

export const getAllUsers = async (users: Collection, query = {}, limit = 50, skip = 0) => {
  try {
    const result = await users.find(query).skip(skip).limit(limit).toArray()
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getUser = async (users: Collection, userID: string) => {
  try {
    const result = await users.findOne({ _id: ObjectId.createFromHexString(userID) })
    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateUser = async (
  users: Collection,
  userID: string,
  updatedField: { name: string; email: string; role: string }
) => {
  try {
    const updatedUser = await users.findOneAndUpdate(
      {
        _id: ObjectId.createFromHexString(userID),
      },
      {
        $set: {
          name: updatedField.name,
          email: updatedField.email,
          role: updatedField.role,
        },
      },
      {
        returnDocument: 'after',
      }
    )

    return updatedUser
  } catch (error) {
    console.error(error)
    return null
  }
}

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
    await userChallengeData.updateOne(
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

    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteOne = async (users: Collection, userID: string) => {
  try {
    if (!ObjectId.isValid(userID)) {
      return { error: 'user id is invalid' }
    }

    const status = await users.deleteOne({
      _id: ObjectId.createFromHexString(userID),
    })

    if (status.deletedCount !== 1) {
      return false
    }

    return true
  } catch (error) {
    console.error(error)
    return null
  }
}
