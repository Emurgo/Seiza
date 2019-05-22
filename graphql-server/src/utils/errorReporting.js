// @flow
import * as Sentry from '@sentry/node'
import _ from 'lodash'
import {isProduction} from '../config'
import _logger from '../logger'

export const getInfoFromError = (error: any, info: any) => {
  if (error == null) {
    return null
  }

  return {
    ...(info || {}),
    ..._.pick(error, Object.getOwnPropertyNames(error)),
  }
}

export const reportError = (error: any, info: any = {}) => {
  isProduction &&
    Sentry.withScope((scope) => {
      scope.setExtras(info)
      Sentry.captureException(error)
    })
}

const initSentry = () => {
  Sentry.init({dsn: process.env.SENTRY_DSN, release: process.env.SENTRY_RELEASE_VERSION})
  Sentry.configureScope((scope) => scope.setTag('source', 'backend'))
}

export const initErrorReporting = () => {
  isProduction && initSentry()
  // unhandledRejection is handled in @sentry/node out of the box

  const handleUnexpectedError = (message) => (error) => {
    // Note: we can not get context here
    _logger.log({level: 'error', message, error})
    reportError(error, getInfoFromError(error))
  }

  process.on('uncaughtException', handleUnexpectedError('uncaughtException'))
  process.on('unhandledRejection', handleUnexpectedError('uncaughtRejection'))
}
