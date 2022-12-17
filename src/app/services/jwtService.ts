import * as jwt from 'jsonwebtoken'
import config from '../../config'
import { NotAuthenticated, NotAuthorized, BadRequest } from '../errors/classes'
import { getUserForUserId } from '../repositories/userRepository'

interface UserPayload {
  user: {
    id: string
    name: string
  }
}

export const generateToken = (payload: UserPayload) => {
  return jwt.sign(payload, config.authentication.jwtSecret, {
    expiresIn: config.authentication.tokenExpiresIn,
  })
}

export type UserJwtPayload = UserPayload & { exp: number; iat: number }

export const verifyToken = async (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as UserJwtPayload
    const user = await getUserForUserId({ id: decoded.user.id })

    if (!user) {
      throw new NotAuthenticated()
    }

    return { user, decoded }
  } catch (error) {
    if (error instanceof NotAuthorized) throw error
    if (error instanceof NotAuthenticated) throw error
    if (error instanceof BadRequest) throw error
    throw new NotAuthenticated()
  }
}

export const getBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    return undefined
  }
  const [bearer, accessToken] = authorizationHeader.split(' ')
  if (!bearer || bearer.toLowerCase() !== 'bearer') {
    return
  }

  return accessToken
}

export const authenticateTokenWithSecret = async (
  token: string | undefined,
  jwtSecret: string
) => {
  if (!token) return
  const verified = await verifyToken(token, jwtSecret)
  if (verified.user) {
    return { user: verified.user, decoded: verified.decoded }
  }
  return { decoded: verified.decoded }
}

export const authenticateToken = async (token: string | undefined) => {
  return (
    await authenticateTokenWithSecret(token, config.authentication.jwtSecret)
  )?.user
}
