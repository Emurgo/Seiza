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
  // TODO: determine proper Ada formater
  const _formatAda = (x) => formatNumber(x, {style: 'decimal', maximumFractionDigits: 0})

  const formatInt = (x, defaultValue = '') => (x != null ? _formatInt(x) : defaultValue)
  const formatPercent = (x, defaultValue = '') => (x != null ? _formatPercent(x) : defaultValue)
  const formatFiat = (x, currency, defaultValue = '') =>
    x != null ? _formatFiat(x, currency) : defaultValue

  const formatAda = (x, defaultValue = '') => (x != null ? _formatAda(x) : defaultValue)

  return {
    translate,
    formatNumber,
    formatInt,
    formatPercent,
    formatFiat,
    formatAda,
  }
}
