import BigNumber from 'bignumber.js'

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

export const getIntlFormatters = (intl) => {
  const translate = intl.formatMessage
  const formatNumber = intl.formatNumber
  const _formatInt = (x) => formatNumber(x, {style: 'decimal', maximumFractionDigits: 0})
  const _formatPercent = (x) => formatNumber(x, {style: 'percent'})
  const _formatFiat = (x, currency, digits = 4) =>
    formatNumber(x, {
      style: 'currency',
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })

  const _formatAda = (x) => {
    const value = new BigNumber(x, 10)
    return value.dividedBy(1000000).toFormat(6)
  }

  const formatInt = (x, defaultValue = '') => (x != null ? _formatInt(x) : defaultValue)
  const formatPercent = (x, defaultValue = '') => (x != null ? _formatPercent(x) : defaultValue)
  const formatAda = (x, defaultValue = '') => (x != null ? _formatAda(x) : defaultValue)
  const formatFiat = (x, currency, defaultValue = '') =>
    x != null ? _formatFiat(x, currency) : defaultValue

  return {
    translate,
    formatNumber,
    formatInt,
    formatPercent,
    formatFiat,
    formatAda,
  }
}
