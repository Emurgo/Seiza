import {initErrorReporting} from '@/helpers/errorReporting'
import config from '@/config'

if (config.isProduction) {
  initErrorReporting()
}
