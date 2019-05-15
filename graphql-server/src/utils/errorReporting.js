// @flow
import * as Sentry from '@sentry/node'
import _ from 'lodash'
import {isProduction} from '../config'

export const reportError = (error: any, info: any) => {
  if (error == null) {
    return
  }

  info = info == null ? _.pick(error, Object.getOwnPropertyNames(error)) : info

  Sentry.withScope((scope) => {
    scope.setExtras(info)
    Sentry.captureException(error)
  })
}

export const initErrorReporting = () => {
  Sentry.init({dsn: process.env.SENTRY_DSN})
  Sentry.configureScope((scope) => scope.setTag('source', 'backend'))
  // unhandledRejection is handled in @sentry/node out of the box
  process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.log('uncaughtException', error.message)
    isProduction && reportError(error)
  })
}
