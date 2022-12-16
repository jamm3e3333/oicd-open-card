import * as testing from '../testing'
import * as cardService from '../../app/services/cardService'

describe('Card state', () => {
  test('Check card state and validity', async () => {
    const { id, name } = await testing.createUser()
    const cardRequestSpyOn = spyOnCardRequest({
      mockRepsonseStatusCode: 200,
    })
    const cardNumber = generateCardNumber(9)
    const response = await testing
      .request()
      .get(`/api/v1/cards/${cardNumber}:checkCardState`)
      .set(testing.setBearer({ user: { id, name } }))

    expect(response.statusCode).toEqual(200)
    expect(cardRequestSpyOn.calledRequests).toHaveLength(2)
    for (const cardRequest of cardRequestSpyOn.calledRequests) {
      expect((cardRequest.param as { cardNumber: number }).cardNumber).toEqual(
        cardNumber
      )
      expect(
        ['/cards/{cardNumber}/state', '/cards/{cardNumber}/validity'].includes(
          cardRequest.url
        )
      ).toEqual(true)
    }
    expect(response.body.card.state).toEqual('Aktivní v držení klienta')
    expect(new Date(response.body.card.validUntil).toISOString()).toBeDefined()
    cardRequestSpyOn.resetMock()
  })
  test('Error response statusCode from cardRequest throws the corresponding error', async () => {
    const { id, name } = await testing.createUser()
    const cardNumber = generateCardNumber(9)
    for (const errorStatusCode of [401, 403, 404, 503]) {
      const cardRequestSpyOn = spyOnCardRequest({
        mockRepsonseStatusCode: errorStatusCode as 200 | 401 | 403 | 503,
      })
      const response = await testing
        .request()
        .get(`/api/v1/cards/${cardNumber}:checkCardState`)
        .set(testing.setBearer({ user: { id, name } }))

      cardRequestSpyOn.resetMock()
      expect(response.statusCode).toEqual(errorStatusCode)
    }
  })
  test('Cannot check card state for invalid card number', async () => {
    const { id, name } = await testing.createUser()
    const cardRequestSpyOn = spyOnCardRequest({
      mockRepsonseStatusCode: 200,
    })
    const response = await testing
      .request()
      .get(`/api/v1/cards/9.3242:checkCardState`)
      .set(testing.setBearer({ user: { id, name } }))

    cardRequestSpyOn.resetMock()
    expect(response.statusCode).toEqual(422)
  })
  test('Not authenticated user cannot check card state', async () => {
    const cardRequestSpyOn = spyOnCardRequest({
      mockRepsonseStatusCode: 200,
    })
    const response = await testing
      .request()
      .get(`/api/v1/cards/9.3242:checkCardState`)

    cardRequestSpyOn.resetMock()
    expect(response.statusCode).toEqual(401)
  })
})

function spyOnCardRequest(option?: {
  mockRepsonseStatusCode: 200 | 401 | 403 | 503
}) {
  const calledRequests: Array<
    Parameters<typeof cardService.cardRequestSender>[0]
  > = []
  const mockRequest = jest
    .spyOn(cardService, 'cardRequestSender')
    .mockImplementation(param => {
      calledRequests.push(param)
      return Promise.resolve({
        body: {
          validity_end: new Date().toISOString(),
          state_description: 'Aktivní v držení klienta',
        },
        status: option?.mockRepsonseStatusCode === 200 ? 'Ok' : 'Error',
        statusCode: option?.mockRepsonseStatusCode ?? 200,
      })
    })
  return {
    calledRequests,
    resetMock: () => mockRequest.mockReset(),
  }
}

function generateCardNumber(cardNumberLength: number) {
  return Math.floor(
    Math.random() * 10 ** Number.parseInt(String(cardNumberLength))
  )
}
