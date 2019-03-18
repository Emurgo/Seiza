//@flow
import React from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import idx from 'idx'
import {Typography, Tooltip} from '@material-ui/core'

import type {ShowSign} from '@/i18n/helpers'
import {useI18n} from '@/i18n/helpers'
import LoadingDots from './LoadingDots'

const useCurrentPrice = (currency) => {
  const {loading, error, data} = useQuery(
    gql`
      query($currency: CurrencyEnum!) {
        currentStatus {
          price(currency: $currency)
        }
      }
    `,
    {
      variables: {
        currency,
      },
    }
  )

  const price = idx(data, (_) => _.currentStatus.price)

  return {
    loading,
    error,
    price,
  }
}

const tooltipMessages = defineMessages({
  priceError: 'Could not load price',
  currentPrice: '~{value}',
})

const convertAdaToFiat = (amount: string, rate: number): number => {
  // TODO: use bignumber?
  return (parseInt(amount, 10) * rate) / 1000000
}

const AdaFiatTooltip = ({value}) => {
  // TODO: get this from context
  const currency = 'USD'
  const {loading, error, price} = useCurrentPrice(currency)
  const {formatFiat, translate: tr} = useI18n()
  return (
    <div>
      {loading ? (
        <LoadingDots />
      ) : error || !price ? (
        tr(tooltipMessages.priceError)
      ) : (
        tr(tooltipMessages.currentPrice, {
          value: formatFiat(convertAdaToFiat(value, price), {currency, digits: 2}),
        })
      )}
    </div>
  )
}

type Props = {|
  +value: string,
  +noValue?: ?React$Node,
  +showCurrency?: boolean,
  +showSign?: ShowSign,
|}

// TODO: once needed, add variant prop
const AdaValue = ({value, noValue, showCurrency, showSign = 'auto'}: Props) => {
  const {formatAdaSplit} = useI18n()

  if (value == null) {
    return noValue || null
  }

  const {integral, fractional} = formatAdaSplit(value, {showSign})
  return (
    <Tooltip enterDelay={1000} title={<AdaFiatTooltip value={value} />} placement="top">
      <span>
        <Typography variant="body1" inline component="span">
          {integral}
        </Typography>
        <Typography variant="caption" color="textSecondary" inline component="span">
          {fractional}
        </Typography>
        {showCurrency && (
          <Typography variant="body1" inline component="span">
            &nbsp;ADA
          </Typography>
        )}
      </span>
    </Tooltip>
  )
}

export default AdaValue
