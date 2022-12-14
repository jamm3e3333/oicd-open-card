import * as request from 'supertest-as-promised'

import app from '../../server'

describe('Template (Integration)', () => {
  describe('Server', () => {
    test('Server does respond', async () => {
      await request(app).get('/').expect(200)
    })
  })
})
