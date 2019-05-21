// @flow
import * as Sentry from '@sentry/node'
import _ from 'lodash'
import {isProduction} from '../config'
import _logger from '../logger'

export const reportError = (error: any, info: any) => {
  if (error == null) {
    return
  }

  info = {
    ...(info || {}),
    ..._.pick(error, Object.getOwnPropertyNames(error)),
  }

  Sentry.withScope((scope) => {
    scope.setExtras(info)
    Sentry.captureException(error)
  })
}

export const initErrorReporting = () => {
  Sentry.init({dsn: process.env.SENTRY_DSN, release: process.env.SENTRY_RELEASE_VERSION})
  Sentry.configureScope((scope) => scope.setTag('source', 'backend'))
  // unhandledRejection is handled in @sentry/node out of the box
  process.on('uncaughtException', (error) => {
    _logger.log({level: 'error', message: 'uncaughtException', error})
    isProduction && reportError(error)
  })
}
