import { NextFunction, Request, Response } from 'express'
import config from '../../config'
import { HttpJsonError } from '../errors/classes'

const errorToProductionObject = <T extends Error>(error: T) => {
  const errorMessage = error.message
  if (error instanceof HttpJsonError) {
    return {
      code: error.code,
      status: error.status,
      message: errorMessage,
    }
  }
  return {
    message: errorMessage,
  }
}

const errorToDevObjectData = <T extends Error>(error: T) => {
  if (error instanceof HttpJsonError) {
    return {
      message: error.message,
      stack: error.stack,
      ...error.errorData,
    }
  }
  return {
    message: error.message,
    stack: error.stack,
  }
}

const httpErrorResponder = (
  error: HttpJsonError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  ;(res as any).error = {
    ...errorToProductionObject(error),
    ...errorToDevObjectData(error),
  }
  const prodError = errorToProductionObject(error)
  res.status(errorToProductionObject(error)?.status ?? error.status ?? 500)
  res.json(
    config.server.nodeEnv === 'development'
      ? errorToDevObjectData(error)
      : { code: prodError.code, message: prodError.message }
  )
}

export default httpErrorResponder
