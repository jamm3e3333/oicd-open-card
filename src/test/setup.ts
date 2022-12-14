import firestore from '../app/database/firestore'
export * from './testing'
jest.setTimeout(25000)

afterAll(async () => {
  await firestore.terminate()
})
