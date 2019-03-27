//@flow
import React from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import cn from 'classnames'
import idx from 'idx'
import {Typography, Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

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
  +value: ?string,
  +noValue?: ?React$Node,
  +showCurrency?: boolean,
  +showSign?: ShowSign,
  +colorful?: boolean,
|}

const usePlusStyles = makeStyles(({palette}) => ({
  integral: {
    color: palette.adaValue.positive,
  },
  fractional: {
    color: palette.adaValue.positive,
  },
  adaSymbol: {
    color: palette.adaValue.positive,
  },
}))

const useMinusStyles = makeStyles(({palette}) => ({
  integral: {
    color: palette.adaValue.negative,
  },
  fractional: {
    color: palette.adaValue.negative,
  },
  adaSymbol: {
    color: palette.adaValue.negative,
  },
}))

const useNeutralStyles = makeStyles(({palette}) => ({
  integral: {
    color: palette.adaValue.neutral,
  },
  fractional: {
    color: palette.adaValue.neutral,
  },
  adaSymbol: {
    color: palette.adaValue.neutral,
  },
}))

const useFontStyles = makeStyles((palette) => ({
  thin: {
    fontWeight: '300',
  },
  thick: {
    fontWeight: '500',
  },
}))

type AdaValueStyleType = 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE'

const getAdaValueStyleType = ({value, colorful}): AdaValueStyleType => {
  if (!colorful) {
    return 'NEUTRAL'
    // TODO: Math.sign works correctly with strings
    // We could use parseFloat, but it has its flaws
    // (parseFloat("40 years") parsed as 40)
    // where Math.sign("40 years") returns NaN
    // $FlowFixMe
  } else if (Math.sign(value) >= 0) {
    return 'POSITIVE'
  } else {
    return 'NEGATIVE'
  }
}

const useAdaValueStyles = ({value, colorful}) => {
  const useStyles = () => ({
    plus: usePlusStyles(),
    minus: useMinusStyles(),
    neutral: useNeutralStyles(),
  })
  const classes = useStyles()

  const adaValueStyleType = getAdaValueStyleType({value, colorful})

  if (adaValueStyleType === 'POSITIVE') {
    return classes.plus
  } else if (adaValueStyleType === 'NEGATIVE') {
    return classes.minus
  } else {
    return classes.neutral
  }
}

// TODO: once needed, add variant prop
const AdaValue = ({value, noValue, showCurrency, showSign = 'auto', colorful = false}: Props) => {
  const {formatAdaSplit} = useI18n()

  const classes = useAdaValueStyles({
    // Note: we want negative styles if we have value='1234' and showSign="-"
    value: value != null && ['+', '-'].includes(showSign) ? `${showSign}${value}` : value,
    colorful,
  })
  const fontClasses = useFontStyles()
  if (value == null) {
    return noValue || null
  }

  const {integral, fractional} = formatAdaSplit(value, {showSign})

  return (
    <Tooltip enterDelay={1000} title={<AdaFiatTooltip value={value} />} placement="top">
      <span>
        <Typography
          variant="body1"
          inline
          component="span"
          className={cn(classes.integral, fontClasses.thick)}
        >
          {integral}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          inline
          component="span"
          className={cn(classes.fractional, fontClasses.thin)}
        >
          {fractional}
        </Typography>
        {showCurrency && (
          <Typography
            variant="body1"
            inline
            component="span"
            className={cn(classes.adaSymbol, fontClasses.thick)}
          >
            &nbsp;ADA
          </Typography>
        )}
      </span>
    </Tooltip>
  )
}

export default AdaValue
