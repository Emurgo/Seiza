// @flow
import BigNumber from 'bignumber.js'
import moment from 'moment'
import {injectIntl} from 'react-intl'
import React, {useContext} from 'react'

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

const STANDARD_READABLE_FORMAT = 'LL LTS'

const MICRO = 1000000

const _formatAda = (x, options) => {
  const value = new BigNumber(x, 10)
  return value.dividedBy(MICRO).toFormat(6)
}

const _formatAdaInteger = (x, options) => {
  const value = new BigNumber(x, 10)
  const integral = value.dividedToIntegerBy(MICRO)
  if (value.lt(0) && value.gt(-MICRO)) {
    // -0 needs special handling
    return '-0'
  } else {
    return integral.toFormat(0)
  }
}

const _formatAdaFractional = (x, options) => {
  const value = new BigNumber(x, 10)
  const fractional = value
    .abs()
    .modulo(MICRO)
    .dividedBy(MICRO)
  // remove leading '0'
  return fractional.toFormat(6).substring(1)
}

const _formatAdaSplit = (x, options) => ({
  integral: _formatAdaInteger(x),
  fractional: _formatAdaFractional(x),
})

type Msg = {
  id: string,
  defaultMessage: string,
}

type Formatters = {
  translate: (msg: Msg, args?: any) => string,
  formatNumber: (x: ?number, options?: any) => string,
  formatInt: (x: ?number, options?: any) => string,
  formatPercent: (x: ?number, options?: any) => string,
  formatFiat: (x: ?number, options?: any) => string,
  // Ada is always as string
  formatAda: (x: ?string, options?: any) => string,
  formatAdaSplit: (x: ?string, options?: any) => {integral: string, fractional: string},
  // Timestamp is always as string
  formatTimestamp: (x: ?string, options?: any) => string,
}

export const getIntlFormatters = (intl: any): Formatters => {
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
    const desiredFormat = options.format || STANDARD_READABLE_FORMAT
    const ts = moment(x)
    if (!ts.isValid) throw new Error('bad timestamp')
    return ts.format(desiredFormat)
  }

  const withDefaultValue = (formatter): any => (x, options = {}) => {
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
  formatTimestamp.FMT_MONTH_NUMERAL = 'L LTS'
  formatTimestamp.FMT_STANDARD = STANDARD_READABLE_FORMAT

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

// $FlowFixMe
export const withI18n = (BaseComponent) =>
  injectIntl(({intl, ...restProps}) => (
    <BaseComponent i18n={getIntlFormatters(intl)} {...restProps} />
  ))

// Experimental hook

// $FlowFixMe
export const IntlContext = React.createContext({})

// turn the old context into the new context
export const InjectHookIntlContext = injectIntl(({intl, children}) => {
  return <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>
})

export const useI18n = (): Formatters => {
  const intl = useContext(IntlContext)
  return getIntlFormatters(intl)
}
