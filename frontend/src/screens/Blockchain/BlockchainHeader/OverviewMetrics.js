// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {useQuery} from 'react-apollo-hooks'
import {Link} from 'react-router-dom'

import {LoadingDots} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {HeaderCard, HeaderCardContainer as MetricsCardContainer} from '@/components/common'
import {routeTo} from '@/helpers/routes'
import config from '@/config'
import useCurrency, {CURRENCIES} from '@/components/hooks/useCurrency'
import useNavigateTo from '@/components/hooks/useNavigateTo'
import {useAnalytics} from '@/components/context/googleAnalytics'

import epochIcon from '@/static/assets/icons/metrics-epoch.svg'
import blocksIcon from '@/static/assets/icons/metrics-blocks.svg'
import decentralizationIcon from '@/static/assets/icons/metrics-decentralization.svg'
import priceIcon from '@/static/assets/icons/metrics-currency.svg'
import poolsIcon from '@/static/assets/icons/metrics-stakepools.svg'

const PRELOAD_FONT_WEIGHT = 300

const usePreloadStyles = makeStyles((theme) => ({
  preload: {
    fontWeight: PRELOAD_FONT_WEIGHT,
    width: 0,
    height: 0,
    opacity: 0,
  },
}))

// Note: not using <link preload /> so that we do not forget to load new font if we change it
// Note: consider adding to common folder if used more than once
const PreloadFont = () => {
  const classes = usePreloadStyles()
  return <span className={classes.preload}>This text is not visible, and just preloads font</span>
}

const text = defineMessages({
  not_available: 'N/A',
  error: 'Err',
  epochLabel: 'Epoch',
  slotsLabel: 'Slot',
  decentralizationLabel: 'Decentralization',
  priceLabel: 'Price',
  poolsLabel: 'Pools',
  searchPlaceholder: 'Search addresses, epochs & slots on the Cardano network',
})

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: '85px',
    [theme.breakpoints.up('md')]: {
      minWidth: '200px',
    },
    minHeight: '75px',
  },
}))
const OVERVIEW_METRICS_QUERY = gql`
  query($currency: CurrencyEnum!) {
    currentStatus {
      blockCount
      latestBlock {
        epoch
      }
      decentralization
      price(currency: $currency)
      stakePoolCount
    }
  }
`
const STATUS_REFRESH_INTERVAL = 20 * 1000

const usePriceItemStyles = makeStyles((theme) => ({
  ada: {
    fontWeight: 300,
  },
}))

const PriceItem = ({currency}) => {
  const classes = usePriceItemStyles()
  return (
    <React.Fragment>
      <span>{currency}&nbsp;/</span>
      <span className={classes.ada}>&nbsp;ADA</span>
    </React.Fragment>
  )
}

const MetricsCard = ({value, metric, ...props}) => (
  <HeaderCard primaryText={value} secondaryText={metric} {...props} />
)

const MetricsCardWithLink = ({to, ...props}) => {
  const handler = useNavigateTo(to)

  return to ? (
    <MetricsCard onClick={handler} clickableWrapperProps={{component: Link, to}} {...props} />
  ) : (
    <MetricsCard {...props} />
  )
}

const OverviewMetrics = () => {
  const classes = useStyles()
  const [currency, setCurrency] = useCurrency()
  const {
    data: {currentStatus: status},
    loading,
    error,
  } = useQuery(OVERVIEW_METRICS_QUERY, {
    pollInterval: STATUS_REFRESH_INTERVAL,
    variables: {
      currency,
    },
  })
  const {translate, formatInt, formatPercent, formatFiat} = useI18n()

  const NA = loading ? <LoadingDots /> : translate(error ? text.error : text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.latestBlock.epoch), {defaultValue: NA})
  const blockCount = formatInt(idx(status, (s) => s.blockCount), {defaultValue: NA})
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), {defaultValue: NA})
  const price = formatFiat(idx(status, (s) => s.price), {currency, defaultValue: NA})
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), {defaultValue: NA})

  const epochLink = status && routeTo.epoch(status.latestBlock.epoch)
  const blockLink = routeTo.blockchain()
  const marketDataLink = routeTo.more()
  const stakePoolsLink = routeTo.stakingCenter.home()

  const analytics = useAnalytics()

  const commonMarketDataProps = {
    className: classes.card,
    icon: <img alt="" src={priceIcon} />,
    secondaryText: translate(text.priceLabel),
    primaryText: price,
    options: [
      {
        label: <PriceItem currency="USD" />,
        onClick: () => {
          analytics.trackCurrencyChanged(CURRENCIES.USD)
          setCurrency(CURRENCIES.USD)
        },
      },
      {
        label: <PriceItem currency="EUR" />,
        onClick: () => {
          analytics.trackCurrencyChanged(CURRENCIES.EUR)
          setCurrency(CURRENCIES.EUR)
        },
      },
      {
        label: <PriceItem currency="YEN" />,
        onClick: () => {
          analytics.trackCurrencyChanged(CURRENCIES.JPY)
          setCurrency(CURRENCIES.JPY)
        },
      },
    ],
  }

  return (
    <Grid container justify="center" wrap="wrap" direction="row">
      <PreloadFont />
      <MetricsCardContainer>
        <MetricsCardWithLink
          className={classes.card}
          icon={<img alt="" src={epochIcon} />}
          value={epochNumber}
          metric={translate(text.epochLabel)}
          to={epochLink}
        />
      </MetricsCardContainer>
      <MetricsCardContainer>
        <MetricsCardWithLink
          className={classes.card}
          icon={<img alt="" src={blocksIcon} />}
          value={blockCount}
          metric={translate(text.slotsLabel)}
          to={blockLink}
        />
      </MetricsCardContainer>
      {config.showStakingData && (
        <MetricsCardContainer>
          <MetricsCard
            className={classes.card}
            icon={<img alt="" src={decentralizationIcon} />}
            value={decentralization}
            metric={translate(text.decentralizationLabel)}
          />
        </MetricsCardContainer>
      )}
      <MetricsCardContainer>
        <MetricsCardWithLink
          {...commonMarketDataProps}
          to={config.showStakingData ? marketDataLink : null}
        />
      </MetricsCardContainer>
      {config.showStakingData && (
        <MetricsCardContainer>
          <MetricsCardWithLink
            className={classes.card}
            icon={<img alt="" src={poolsIcon} />}
            value={pools}
            metric={translate(text.poolsLabel)}
            to={stakePoolsLink}
          />
        </MetricsCardContainer>
      )}
    </Grid>
  )
}

export default OverviewMetrics
