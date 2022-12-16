import { createLoader, safeValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.json',
})

const configSchema = {
  server: {
    port: loader.number('PORT'),
    nodeEnv: loader.custom(x => x as 'development' | 'production')('NODE_ENV'),
  },
  enableTests: loader.bool('ENABLE_TESTS'),
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
  authentication: {
    jwtSecret: loader.string.hidden('JWT_SECRET'),
    tokenExpiresIn: 3600 * 24, // 1 day
  },
  firebase: {
    serviceAccount: loader.json.hidden('SERVICE_ACCOUNT'),
    isFirestoreEmaulator: loader.bool('IS_FIRESTORE_EMULATOR_USE'),
  },
  openCard: {
    apiKey: loader.string.hidden('OPEN_CARD_API_KEY'),
    baseUrl: loader.string('OPEN_CARD_BASE_URL'),
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
