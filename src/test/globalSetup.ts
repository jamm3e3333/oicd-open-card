import logger from '../app/logger'
import config, { safeConfig } from '../config'

export default async () => {
  logger.info(safeConfig)

  if (!config.enableTests) {
    throw Error(
      'Tests are disabled. Please set "ENABLE_TESTS" configuration variable.'
    )
  }
}
