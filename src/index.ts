import 'source-map-support/register'
import logger from './app/logger'
import server from './server'

import config, { safeConfig } from './config'

logger.info(safeConfig, 'Loaded config')
server.listen(config.server.port, () => {
  logger.info(`Server started on port ${config.server.port}`)
})
