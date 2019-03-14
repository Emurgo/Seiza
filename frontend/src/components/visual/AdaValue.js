//@flow
import React from 'react'

import {Typography, Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import LoadingDots from './LoadingDots'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    '& > *': {
      display: 'inline',
    },
  },
}))

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
  return {
    loading,
    error,
    price: data.currentStatus.price,
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
      {error ? (
        tr(tooltipMessages.priceError)
      ) : loading ? (
        <LoadingDots />
      ) : (
        tr(tooltipMessages.currentPrice, {
          value: formatFiat(convertAdaToFiat(value, price), {currency, digits: 2}),
        })
      )}
    </div>
  )
}

type Props = {
  value: string,
  options: any, // TODO
  showCurrency?: boolean,
  withSign?: boolean,
}

// TODO: once needed, add variant prop
const AdaValue = ({value, options, showCurrency, withSign = false}: Props) => {
  const {formatAdaSplit} = useI18n()
  const classes = useStyles()

  if (value == null) {
    return options.defaultValue
  }
  const formatted = formatAdaSplit(value, {withSign: false})
  return (
    <Tooltip enterDelay={1000} title={<AdaFiatTooltip value={value} />}>
      <span className={classes.wrapper}>
        <Typography variant="body1" component="span">
          {formatted.integral}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatted.fractional}
        </Typography>
        <Typography variant="body1" component="span">
          {showCurrency ? ' ADA' : ''}
        </Typography>
      </span>
    </Tooltip>
  )
}

export default AdaValue
