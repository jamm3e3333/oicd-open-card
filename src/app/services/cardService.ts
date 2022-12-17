import * as openapi from '../../openapi-gen'
import * as ctrl from '../controllers'
import * as util from '../util'
import {
  NotAuthenticated,
  NotAuthorized,
  NotFound,
  ServiceUnavailable,
  ValidationError,
} from '../errors/classes'
import { E_CODES } from '../errors'
import axios from 'axios'
import config from '../../config'
import { openCardLogger } from '../logger'

const maskCardRequestError = <T>(promise: Promise<T>) => {
  return promise.catch(error => {
    if ([401, 403, 404].includes(error.status)) {
      throw error
    }
    throw new ServiceUnavailable(E_CODES.C5000)
  })
}

interface CardRequest {
  url: '/cards/{cardNumber}/state' | '/cards/{cardNumber}/validity'
  body?: any
  param?: Record<any, any>
  headers?: Record<any, any>
  method?: 'get' | 'post'
}

interface CardResponse<T = any> {
  statusCode: number
  status: string
  body: T
  headers?: Record<any, any>
}

export const cardRequestSender = async <TBody = any>(
  param: CardRequest
): Promise<CardResponse<TBody>> => {
  let url: string = param.url
  Object.keys((param?.param as any) ?? {}).forEach(paramName => {
    url = url.replace(`{${paramName}}`, (param?.param as any)[paramName])
  })
  const response = await axios<TBody>({
    url,
    baseURL: config.openCard.baseUrl,
    headers: {
      ...param.headers,
      'X-API-Key': config.openCard.apiKey,
    },
    ...(param.method !== 'get' && { data: param.body }),
    method: param.method ?? 'get',
  })
  return {
    body: response.data,
    status: response.statusText,
    statusCode: response.status,
    headers: response.headers,
  }
}

const cardRequest = async <TBody>(
  param: CardRequest,
  sender: typeof cardRequestSender
) => {
  const response = await sender<TBody>(param)
  if (String(response.statusCode).startsWith('2')) {
    return response
  }
  if (response.statusCode === 401) {
    throw new NotAuthenticated()
  }
  if (response.statusCode === 403) {
    throw new NotAuthorized()
  }
  if (response.statusCode === 404) {
    throw new NotFound()
  }
  openCardLogger.error({
    statusCode: response.statusCode,
    status: response.status,
    url: param.url,
    ...(param.param !== undefined && { pathParameters: param.param }),
    method: param.method ?? 'get',
  })
  throw new Error('OpenCard API error.')
}

const validateCardNumber = (cardNumber: number) => {
  if (!util.validateIntegerNumber(cardNumber)) {
    throw new ValidationError(E_CODES.C4000)
  }
}

export const handleGetCardState = async (
  context: any
): Promise<
  openapi.OpenAPIRouteResponseBody<
    openapi.paths['/api/v1/cards/{cardNumber}:checkCardState']
  >
> =>
  util.pipe(
    util.checkAuth,
    () =>
      ctrl.getContextTyped<
        openapi.paths['/api/v1/cards/{cardNumber}:checkCardState']
      >(context),
    async context => {
      const { cardNumber } = context.param
      validateCardNumber(cardNumber)

      const [responseCardStatus, responseCardValidity] = await Promise.all([
        maskCardRequestError(
          cardRequest<{
            state_id: number
            state_description: string
          }>(
            { url: '/cards/{cardNumber}/state', param: { cardNumber } },
            cardRequestSender
          )
        ),
        maskCardRequestError(
          cardRequest<{
            validity_start: string
            validity_end: string
          }>(
            { url: '/cards/{cardNumber}/validity', param: { cardNumber } },
            cardRequestSender
          )
        ),
      ])
      return {
        card: {
          validUntil: new Date(
            responseCardValidity.body.validity_end
          ).toISOString(),
          state: responseCardStatus.body.state_description,
        },
      }
    }
  )(context)
