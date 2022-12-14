import * as express from 'express'
import * as ctrl from './app/controllers'
import * as userService from './app/services/userService'
import * as OpenApiValidator from 'express-openapi-validator'
import logger from './app/logger'
import httpErrorResponder from './app/controllers/httpErrorResponder'

const validator = OpenApiValidator.middleware({
  apiSpec: './docs/api/openapi.yaml',
  ignorePaths: /\/{1}$/,
})

const server = express()
server.use(express.json())
server.use(ctrl.cors)
server.use(logger.express)
server.use(validator)

server.all('/', ctrl.httpRootHandler)
server.post('/api/v1/users', ctrl.service(userService.handlePostUser))
server.post('/api/v1/sessions', ctrl.service(userService.handlePostSession))

server.use(httpErrorResponder)
server.use(ctrl.httpFinalHandler)

export default server
