// @flow

// TODO: move to utils folder

import winston from 'winston'
import {isProduction} from './config'

const logFormat = isProduction
  ? winston.format.printf((value) => JSON.stringify(value))
  : winston.format.printf((value) => `${JSON.stringify(value, null, 4)}\n`)

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: TIMESTAMP_FORMAT,
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'verbose',
      format: winston.format.combine(
        winston.format.timestamp({
          format: TIMESTAMP_FORMAT,
        }),
        // TODO: consider using if we have separate console/file logs
        // winston.format.colorize(),
        logFormat
      ),
    }),
    //
    // - Write to all logs with level `info` and below level to `combined.log`
    // - Write all logs error (and below level) to `error.log`.
    //
    // new winston.transports.File({filename: 'error.log', level: 'error'}),
    // new winston.transports.File({filename: 'combined.log'}),
  ],
})
