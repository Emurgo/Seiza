//@flow
import React from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import cn from 'classnames'
import idx from 'idx'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Tooltip} from '@/components/visual'
import type {ShowSign} from '@/i18n/helpers'
import {useI18n} from '@/i18n/helpers'
import useCurrency from '@/components/hooks/useCurrency'
import LoadingDots from './LoadingDots'
import moment from 'moment-timezone'

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

const useHistoricalPrice = (currency, timestamp, shouldFetch) => {
  const {loading, error, data} = useQuery(
    gql`
      query($currency: CurrencyEnum!, $timestamp: Timestamp!) {
        averageDailyPrice(currency: $currency, timestamp: $timestamp)
      }
    `,
    {
      variables: {
        currency,
        timestamp: moment(timestamp)
          .utc()
          .startOf('day')
          .toISOString(),
      },
      skip: !shouldFetch,
    }
  )

  const price = idx(data, (_) => _.averageDailyPrice)

  return {
    loading,
    error,
    price,
  }
}

const tooltipMessages = defineMessages({
  priceError: 'Could not load price',
  currentPrice: '~{value}',
  historyPrice: '(~{value} at time)',
})

const convertAdaToFiat = (amount: string, rate: number): number => {
  // Note: bignumber not needed as the rate is anyway only approximate
  return (parseInt(amount, 10) * rate) / 1000000
}

const useTooltipStyles = makeStyles(() => ({
  wrapper: {
    // Needed because when tooltip opens with
    // loading state, it gets too narrow and expanding
    // it later leaves it too much to the right
    minWidth: 70,
  },
  value: {
    textAlign: 'right',
  },
}))

const AdaFiatTooltip = ({value, timestamp}) => {
  const {formatFiat, translate: tr} = useI18n()
  const [currency] = useCurrency()
  const {loading, error, price} = useCurrentPrice(currency)
  const classes = useTooltipStyles()

  // Note: we need to compare UTC start of days as server gives us
  // UTC-day averages
  const isHistoricalTimestamp = moment(timestamp)
    .utc()
    .startOf('day')
    .isBefore(
      moment()
        .utc()
        .startOf('day')
    )

  const {loading: historyLoading, error: historyError, price: historyPrice} = useHistoricalPrice(
    currency,
    timestamp,
    isHistoricalTimestamp
  )

  const _format = (value, rate) =>
    formatFiat(convertAdaToFiat(value, rate || 0), {
      currency,
      currencyDisplay: 'code',
      digits: 2,
    })

  return (
    <div className={classes.wrapper}>
      {loading || (isHistoricalTimestamp && historyLoading) ? (
        <LoadingDots />
      ) : error || (isHistoricalTimestamp && historyError) || !price ? (
        tr(tooltipMessages.priceError)
      ) : (
        <React.Fragment>
          <div className={classes.value}>
            {tr(tooltipMessages.currentPrice, {
              value: _format(value, price),
            })}
          </div>
          <div className={classes.value}>
            {historyPrice != null &&
              isHistoricalTimestamp &&
              tr(tooltipMessages.historyPrice, {
                value: _format(value, historyPrice),
              })}
          </div>
        </React.Fragment>
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
  +timestamp?: any,
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

const useFontStyles = makeStyles((theme) => ({
  thin: {
    fontWeight: '200',
  },
  thick: {
    fontWeight: '400', // Default font-weight
  },
}))

type ColorType = 'neutral' | 'plus' | 'minus'

const getColorType = ({value, colorful}): ColorType => {
  if (!colorful) return 'neutral'

  // Note: Math.sign works correctly with strings
  // We could use parseFloat, but it has its flaws
  // (parseFloat("40 years") parsed as 40)
  // where Math.sign("40 years") returns NaN
  // $FlowFixMe
  return Math.sign(value) >= 0 ? 'plus' : 'minus'
}

const useAdaValueStyles = ({value, colorful}) => {
  const classes = {
    plus: usePlusStyles(),
    minus: useMinusStyles(),
    neutral: useNeutralStyles(),
  }

  return classes[getColorType({value, colorful})]
}

// TODO: once needed, add variant prop
const AdaValue = ({
  value,
  noValue,
  showCurrency,
  showSign = 'auto',
  colorful = false,
  timestamp,
}: Props) => {
  const {formatAdaSplit} = useI18n()

  const fontClasses = useFontStyles()
  const classes = useAdaValueStyles({
    // Note: we want negative styles if we have value='1234' and showSign="-"
    value: value != null && ['+', '-'].includes(showSign) ? `${showSign}${value}` : value,
    colorful,
  })

  if (value == null) {
    return noValue || null
  }

  const {integral, fractional} = formatAdaSplit(value, {showSign})

  return (
    <Tooltip
      enterDelay={250}
      title={<AdaFiatTooltip value={value} timestamp={timestamp} />}
      placement="top"
    >
      <span>
        <Typography
          variant="body1"
          component="span"
          className={cn(classes.integral, fontClasses.thick)}
        >
          {integral}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          component="span"
          className={cn(classes.fractional, fontClasses.thin)}
        >
          {fractional}
        </Typography>
        {showCurrency && (
          <Typography
            variant="body1"
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
