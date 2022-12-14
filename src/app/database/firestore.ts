import * as firebase from 'firebase-admin'
import config from '../../config'
import { Firestore } from '@google-cloud/firestore'

const getFirestoreForEmulator = () => {
  const firestore = new Firestore()
  firestore.settings({
    projectId: 'test',
    credentials: {},
  })
  return firestore
}

// For tests and emulator usage, use Firestore emulator without specifying SA key
const firestore =
  config.enableTests || config.firebase.isFirestoreEmaulator
    ? getFirestoreForEmulator()
    : firebase
        .initializeApp({
          credential: firebase.credential.cert(config.firebase.serviceAccount),
        })
        .firestore()

export default firestore

export const getDataFromQuerySnapshots = async <T>(
  snapshots: Promise<FirebaseFirestore.QuerySnapshot>
) => {
  return (await snapshots).docs.map(x => ({
    id: x.id,
    ...x.data(),
  })) as T[] | []
}
