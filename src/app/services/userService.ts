import * as openapi from '../../openapi-gen'
import { createUser, getUserForName } from '../repositories/userRepository'
import * as ctrl from '../controllers'
import * as util from '../util'
import * as jwt from '../services/jwtService'
import { NotFound, ValidationError } from '../errors/classes'
import { E_CODES } from '../errors'

const validateUserName = (name: string) => {
  if (name.length < 5) {
    throw new ValidationError(E_CODES.U4001)
  }
}

const validatePassword = (password: string) => {
  if (!util.validatePassword(password)) {
    throw new ValidationError(E_CODES.U4002)
  }
}

const modifyUserName = (email: string) => email.trim()

export const handlePostUser = async (
  context: any
): Promise<openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/users']>> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/users']>(context),
    async context => {
      const { name, passwd } = context.requestBody.user
      const password = passwd.trim()
      const userName = modifyUserName(name)
      validateUserName(userName)
      validatePassword(password)
      const { hash, salt } = await util.hashPassword(password)
      const user = await createUser({
        name: userName,
        hash,
        salt,
      })
      const token = jwt.generateToken({
        user: {
          name: userName,
          id: (user as any).id,
        },
      })
      return { token }
    }
  )(context)

export const handlePostSession = async (
  context: any
): Promise<
  openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/sessions']>
> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/sessions']>(context),
    async context => {
      const { name, passwd } = context.requestBody.user
      const userName = modifyUserName(name)
      validateUserName(userName)
      const user = await getUserForName({ name: userName })
      if (!user) {
        throw new NotFound()
      }
      await util.checkPassword({
        password: passwd.trim(),
        hashForCompare: user.hash,
        salt: user.salt,
      })
      const token = jwt.generateToken({
        user: { name: userName, id: user.id },
      })
      return { token }
    }
  )(context)
