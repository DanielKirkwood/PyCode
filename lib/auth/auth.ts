/*
  Important: this file can only be used on server as argon2 uses 'fs'
  You can use it in getServerSideProps if need be
*/

import argon2 from 'argon2'

export const hashPassword = async (password: string) => {
  return await argon2.hash(password)
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  try {
    return await argon2.verify(hashedPassword, password)
  } catch (err) {
    console.error(err)
    return false
  }
}
