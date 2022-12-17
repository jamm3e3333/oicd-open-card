import logger from 'cosmas'
import config from '../config'

const baseLogger = logger({
  ...config.logger,
})

export default baseLogger

export const openCardLogger = baseLogger('.openCard')
