import * as userRepository from '../app/repositories/userRepository'
import * as supertest from 'supertest'
import * as jwt from '../app/services/jwtService'
import * as crypto from 'crypto'
import * as util from '../app/util'
import server from '../server'

export const request = () => supertest(server)

export const setBearer = (user: Parameters<typeof jwt.generateToken>[0]) => ({
  Authorization: `Bearer ${jwt.generateToken(user)}`,
})

export const createUser = async (
  user?: Partial<Pick<userRepository.User, 'name'>> & { password?: string }
) => {
  const exisitingUser = await userRepository.getUserForName({
    name: user?.name ?? '-1',
  })
  if (exisitingUser) {
    return exisitingUser
  }
  const password = user?.password ?? generateRandomString(5)
  const userHashContext = await util.hashPassword(password)
  const createdUser: { id: string } | userRepository.User =
    await userRepository.createUser({
      hash: userHashContext.hash,
      salt: userHashContext.salt,
      name: user?.name ?? generateRandomString(5),
    })
  return {
    ...(await userRepository.getUserForUserId({ id: createdUser.id })),
    password,
  }
}

/**
 *
 * @param stringLength default str length is 5
 */
export const generateRandomString = (stringLength = 5) =>
  crypto.randomBytes(stringLength <= 0 ? 1 : stringLength).toString('hex')

export const generateRandomPassword = () => `Ah9${generateRandomString()}`
