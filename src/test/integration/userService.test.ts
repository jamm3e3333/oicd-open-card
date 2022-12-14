import * as userRepository from '../../app/repositories/userRepository'
import * as testing from '../setup'
import * as util from '../../app/util'

describe('Create', () => {
  test('Create user', async () => {
    const userCtx = {
      name: testing.generateRandomString(),
      passwd: testing.generateRandomPassword(),
    }
    const response = await testing
      .request()
      .post('/api/v1/users')
      .send({ user: userCtx })
    expect(response.statusCode).toEqual(200)
    expect(response.body.token).toBeDefined()

    const user = await userRepository.getUserForName({
      name: userCtx.name,
    })
    expect(() =>
      util.checkPassword({
        password: userCtx.passwd,
        hashForCompare: user.hash,
        salt: user.salt,
      })
    ).not.toThrowError()
  })
  test('Cannot create user with missing name', async () => {
    const userCtx = {
      passwd: testing.generateRandomPassword(),
    }
    const response = await testing
      .request()
      .post('/api/v1/users')
      .send({ user: userCtx })
    expect(response.statusCode).toEqual(400)
  })
  test('Cannot create user with invalid password', async () => {
    const userCtx = {
      passwd: 'bla',
      name: testing.generateRandomString(),
    }
    const response = await testing
      .request()
      .post('/api/v1/users')
      .send({ user: userCtx })
    expect(response.statusCode).toEqual(422)

    const user = await userRepository.getUserForName({ name: userCtx.name })
    expect(user).toBeUndefined()
  })
  test('Cannot create duplicate user', async () => {
    const createdUser = await testing.createUser()
    const response = await testing
      .request()
      .post('/api/v1/users')
      .send({
        user: {
          name: createdUser.name,
          passwd:
            'password' in createdUser
              ? createdUser.password
              : testing.generateRandomPassword(),
        },
      })
    expect(response.statusCode).toEqual(422)
  })
})
