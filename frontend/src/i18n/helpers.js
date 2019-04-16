// @flow
import BigNumber from 'bignumber.js'
import moment from 'moment'
import {injectIntl} from 'react-intl'
import React, {useContext} from 'react'
import {compose} from 'redux'
import _ from 'lodash'
import assert from 'assert'

import 'moment/locale/ja'
import 'moment/locale/ru'

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

const _formatAdaInUnits = (x, {unit = 1000000000, decimalPlaces = 1}) => {
  const value = new BigNumber(x, 10)
  return value
    .dividedBy(MICRO)
    .dividedBy(unit)
    .toFormat(decimalPlaces)
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

// TODO: fix this function for all cases
const _isNumeric = (n) => {
  const _parsed = parseFloat(n)
  return `${n}` === `${_parsed}` && _.isNumber(_parsed) && _.isFinite(_parsed)
}

type GetSignFn = (x: string) => string

const _stripSign = (x: string): string =>
  x.substring(0, 1) === '-' || x.substring(0, 1) === '+' ? x.substring(1) : x

const _getSignAuto: GetSignFn = (x) => (x.substring(0, 1) === '-' ? '-' : '')
const _getSignNever: GetSignFn = (x) => ''
const _getSignAlways: GetSignFn = (x) => (x.substring(0, 1) === '-' ? '-' : '+')
const _getSignPlus: GetSignFn = (x) => '+'
const _getSignMinus: GetSignFn = (x) => '-'

const GET_SIGN = {
  'auto': _getSignAuto,
  'never': _getSignNever,
  'always': _getSignAlways,
  '+': _getSignPlus,
  '-': _getSignMinus,
}

export type ShowSign = $Keys<typeof GET_SIGN>

const plusOrMinus: $ReadOnlyArray<ShowSign> = ['+', '-']
const _withSign = (x: string, showSign: ShowSign): string => {
  // when client uses "+" or "-", we allow only posisitve numbers
  if (plusOrMinus.includes(showSign)) {
    assert.notEqual(x.substring(0, 1), '-', 'The number should be positive')
  }

  return `${GET_SIGN[showSign](x)}${_stripSign(x)}`
}

type Msg =
  | {
      id: string,
      defaultMessage?: string,
    }
  | string

type Formatters = {
  translate: (msg: Msg, args?: any) => string,
  formatNumber: (x: ?number, options?: any) => string,
  formatInt: (x: ?number, options?: any) => string,
  formatPercent: (x: ?number, options?: any) => string,
  formatFiat: (x: ?number, options?: any) => string,
  // Ada is always as string
  formatAda: (x: ?string, options?: any) => string,
  formatAdaSplit: (x: ?string, options?: any) => {integral: string, fractional: string},
  formatAdaInUnits: (x: ?string, options?: any) => string,
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

  type FormatTimestampOptions = {
    format: string,
  }

  const _formatTimestamp = (x, options: FormatTimestampOptions) => {
    const desiredFormat = options.format || STANDARD_READABLE_FORMAT
    const ts = moment(x).locale(intl.locale)
    if (!ts.isValid) throw new Error('bad timestamp')
    return ts.format(desiredFormat)
  }

  const withDefaultValue = (formatter): any => (x, options = {}) => {
    const {defaultValue, ...restOptions} = options
    if (x == null) return defaultValue || ''
    return formatter(x, restOptions)
  }

  // TODO: we should compare ADA values to zero as BigNumbers, not directly
  const withFormatSign = (formatter): any => (x, options = {}): string => {
    const {showSign = 'auto', ...restOptions} = options
    const formatted = formatter(x, restOptions)

    if (_isNumeric(formatted)) {
      // TODO: This won't work with Arabic language,
      // because we're working with formatted value
      return _withSign(formatted, showSign)
    }

    return formatted
  }

  const withFormatSignAdaSplit = (formatter): any => (x, options = {}) => {
    const {showSign = 'auto', ...restOptions} = options
    const formatted = formatter(x, restOptions)

    if (_isNumeric(x)) {
      return {
        ...formatted,
        // TODO: This won't work with Arabic language,
        // because we're working with formatted value
        integral: _withSign(formatted.integral, showSign),
      }
    }
    return formatted
  }

  const withSignAndDefaultValue = compose(
    withFormatSign,
    withDefaultValue
  )

  const formatInt = withSignAndDefaultValue(_formatInt)
  const formatPercent = withSignAndDefaultValue(_formatPercent)
  const formatAda = withSignAndDefaultValue(_formatAda)
  const formatAdaSplit = compose(
    withDefaultValue,
    withFormatSignAdaSplit
  )(_formatAdaSplit)
  const formatFiat = withSignAndDefaultValue(_formatFiat)

  const formatTimestamp = withDefaultValue(_formatTimestamp)
  const formatAdaInUnits = withSignAndDefaultValue(_formatAdaInUnits)
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
    formatAdaInUnits,
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
