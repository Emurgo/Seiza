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

const MICRO = 1000000

const _formatAda = (x) => {
  const value = new BigNumber(x, 10)
  return value.dividedBy(MICRO).toFormat(6)
}

const _formatAdaInteger = (x) => {
  const value = new BigNumber(x, 10)
  const integral = value.dividedToIntegerBy(MICRO)
  if (value.lt(0) && value.gt(-MICRO)) {
    // -0 needs special handling
    return '-0'
  } else {
    return integral.toFormat(0)
  }
}

const _formatAdaFractional = (x) => {
  const value = new BigNumber(x, 10)
  const fractional = value
    .abs()
    .modulo(MICRO)
    .dividedBy(MICRO)
  // remove leading '0'
  return fractional.toFormat(6).substring(1)
}

const _formatAdaSplit = (x) => ({
  integral: _formatAdaInteger(x),
  fractional: _formatAdaFractional(x),
})

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
  const formatAdaSplit = withDefaultValue(_formatAdaSplit)
  const formatFiat = withDefaultValue(_formatFiat)

  const formatTimestamp = withDefaultValue(_formatTimestamp)
  formatTimestamp.FMT_SHORT_DATE = 'L'

  return {
    translate,
    formatNumber,
    formatInt,
    formatPercent,
    formatFiat,
    formatAda,
    formatAdaSplit,
    formatTimestamp,
  }
}

export const withI18n = (BaseComponent) =>
  injectIntl(({intl, ...restProps}) => (
    <BaseComponent i18n={getIntlFormatters(intl)} {...restProps} />
  ))
