import * as pipe from 'p-pipe'
import { randomBytes, pbkdf2 } from 'crypto'
import { promisify } from 'util'
import { HttpContext } from './controllers'
import { NotAuthenticated } from './errors/classes'

export { pipe }

export type Unpromise<T> = T extends Promise<infer U> ? U : T

export const checkAuth = (context: HttpContext) => {
  if (!context.authenticated && !context.user?.id) {
    throw new NotAuthenticated()
  }
  return context
}

const pbkdf2Promisified = promisify(pbkdf2)

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex')
  const hash = (
    await pbkdf2Promisified(password, salt, 1000, 64, 'sha512')
  ).toString('hex')
  return {
    salt,
    hash,
  }
}

export const checkPassword = async (param: {
  password: string
  salt: string
  hashForCompare: string
}) => {
  const hash = (
    await pbkdf2Promisified(param.password, param.salt, 1000, 64, 'sha512')
  ).toString('hex')
  if (param.hashForCompare !== hash) {
    throw new NotAuthenticated()
  }
}

// Password validation RegEx -> Minimum eight characters, at least one uppercase letter, one lowercase letter, at least one number and no special character
const PASSWD_REGEX_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

export const validatePassword = (password: string) =>
  PASSWD_REGEX_VALIDATION.test(password)

const INTEGER_REGEX_VALIDATION = /^[0-9]*$/

export const validateIntegerNumber = (numberForValidation: number) =>
  INTEGER_REGEX_VALIDATION.test(String(numberForValidation))
