import BigNumber from 'bignumber.js'
import moment from 'moment'
import {injectIntl} from 'react-intl'
import React from 'react'

const defaultNumberFmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSize: 0,
  fractionGroupSeparator: ' ',
  suffix: '',
}

BigNumber.config({
  FORMAT: defaultNumberFmt,
})

export const monthNumeralFormat = 'L LTS'
export const standardReadableFormat = 'LL LTS'

export const getIntlFormatters = (intl) => {
  const translate = intl.formatMessage
  const formatNumber = intl.formatNumber
  const _formatInt = (x, options = {}) =>
    formatNumber(x, {
      style: 'decimal',
      maximumFractionDigits: 0,
      ...options,
    })
  const _formatPercent = (x, options) => formatNumber(x, {style: 'percent', ...options})
  const _formatFiat = (x, options = {}) => {
    const {currency, digits = 4} = options
    return formatNumber(x, {
      style: 'currency',
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  }

  const _formatAda = (x) => {
    const value = new BigNumber(x, 10)
    return value.dividedBy(1000000).toFormat(6)
  }

  const _formatTimestamp = (x, options) => {
    const desiredFormat = options.format || standardReadableFormat
    const ts = moment(x)
    if (!ts.isValid) throw new Error('bad timestamp')
    return ts.format(desiredFormat)
  }
  const withDefaultValue = (formatter) => (x, options = {}) => {
    const {defaultValue, ...restOptions} = options
    if (x == null) return defaultValue || ''
    return formatter(x, restOptions)
  }

  const formatInt = withDefaultValue(_formatInt)
  const formatPercent = withDefaultValue(_formatPercent)
  const formatAda = withDefaultValue(_formatAda)
  const formatFiat = withDefaultValue(_formatFiat)
  const formatTimestamp = withDefaultValue(_formatTimestamp)

  return {
    translate,
    formatNumber,
    formatInt,
    formatPercent,
    formatFiat,
    formatAda,
    formatTimestamp,
  }
}

export const withI18n = (BaseComponent) =>
  injectIntl(({intl, ...restProps}) => (
    <BaseComponent i18n={getIntlFormatters(intl)} {...restProps} />
  ))
