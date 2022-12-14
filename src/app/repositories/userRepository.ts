import firestore, { getDataFromQuerySnapshots } from '../database/firestore'
import { FieldPath } from 'firebase-admin/firestore'
import { E_CODES } from '../errors'
import { ValidationError } from '../errors/classes'

export interface User {
  id: string
  name: string
  hash: string
  salt: string
}

const userRepository = firestore.collection('users')

export const getUserForUserId = async (user: Pick<User, 'id'>) => {
  const [userData] = await getDataFromQuerySnapshots<User>(
    userRepository.where(FieldPath.documentId(), '==', user.id).limit(1).get()
  )
  return userData
}

export const getUserForName = async (user: Pick<User, 'name'>) => {
  const [userData] = await getDataFromQuerySnapshots<User>(
    userRepository.where('name', '==', user.name).limit(1).get()
  )
  return userData
}

export const createUser = async (
  user: Pick<User, 'name' | 'hash' | 'salt'>
) => {
  const existingUser = await getUserForName(user)
  if (existingUser) {
    throw new ValidationError(E_CODES.U4000)
  }
  const { name, hash, salt } = user
  return userRepository.add({
    name,
    hash,
    salt,
  })
}
