// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'

import {Grid, createStyles, withStyles} from '@material-ui/core'
import {MetricsCard, LoadingDots} from '@/components/visual'
import {getIntlFormatters} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import WithNavigateTo from '@/components/headless/navigateTo'
import {Link} from 'react-router-dom'

import config from '@/config'
import useCurrency, {CURRENCIES} from '@/components/hooks/useCurrency'
import {useQuery} from 'react-apollo-hooks'

const text = defineMessages({
  not_available: 'N/A',
  error: 'Err',
  epochLabel: 'Epoch',
  blocksLabel: 'Blocks',
  decentralizationLabel: 'Decentralization',
  priceLabel: 'Price',
  poolsLabel: 'Pools',
  searchPlaceholder: 'Search addresses, epochs & slots on the Cardano network',
})

const styles = (theme) =>
  createStyles({
    card: {
      minWidth: '200px',
      minHeight: '75px',
    },
    cardDimensions: {
      marginRight: theme.spacing.unit * 1.5,
      marginLeft: theme.spacing.unit * 1.5,
    },
  })

const GridItem = withStyles(styles)(({children, classes}) => (
  <Grid item className={classes.cardDimensions}>
    {children}
  </Grid>
))

const OVERVIEW_METRICS_QUERY = gql`
  query($currency: CurrencyEnum!) {
    currentStatus {
      blockCount
      latestBlock {
        blockHash
        epoch
      }
      decentralization
      price(currency: $currency)
      stakePoolCount
    }
  }
`
const STATUS_REFRESH_INTERVAL = 20 * 1000

const OverviewMetrics = ({intl, data, classes}) => {
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
  const {translate, formatInt, formatPercent, formatFiat} = getIntlFormatters(intl)

  const NA = loading ? <LoadingDots /> : translate(error ? text.error : text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.latestBlock.epoch), {defaultValue: NA})
  const blockCount = formatInt(idx(status, (s) => s.blockCount), {defaultValue: NA})
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), {defaultValue: NA})
  const price = formatFiat(idx(status, (s) => s.price), {currency, defaultValue: NA})
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), {defaultValue: NA})

  const epochLink = status && routeTo.epoch(status.latestBlock.epoch)
  const blockLink = status && routeTo.block(status.latestBlock.blockHash)
  const marketDataLink = routeTo.more()
  const stakePoolsLink = routeTo.staking.home()

  const commonMarketDataProps = {
    className: classes.card,
    icon: 'price',
    metric: translate(text.priceLabel),
    value: price,
    options: [
      {
        label: 'USD/ADA',
        onClick: () => setCurrency(CURRENCIES.USD),
      },
      {
        label: 'EUR/ADA',
        onClick: () => setCurrency(CURRENCIES.EUR),
      },
      {
        label: 'YEN/ADA',
        onClick: () => setCurrency(CURRENCIES.JPY),
      },
    ],
  }

  return (
    <Grid container justify="center" wrap="wrap" direction="row">
      <Grid item className={classes.cardDimensions}>
        <WithNavigateTo to={epochLink}>
          {({navigate}) => (
            <MetricsCard
              className={classes.card}
              icon="epoch"
              metric={translate(text.epochLabel)}
              value={epochNumber}
              onClick={navigate}
              clickableWrapperProps={{component: Link, to: epochLink}}
            />
          )}
        </WithNavigateTo>
      </Grid>
      <GridItem>
        <WithNavigateTo to={stakePoolsLink}>
          {({navigate}) => (
            <MetricsCard
              className={classes.card}
              icon="blocks"
              metric={translate(text.blocksLabel)}
              value={blockCount}
              onClick={navigate}
              clickableWrapperProps={{component: Link, to: blockLink}}
            />
          )}
        </WithNavigateTo>
      </GridItem>
      {config.showStakingData && (
        <GridItem>
          <MetricsCard
            className={classes.card}
            icon="decentralization"
            metric={translate(text.decentralizationLabel)}
            value={decentralization}
          />
        </GridItem>
      )}
      <GridItem>
        {config.showStakingData ? (
          <WithNavigateTo to={marketDataLink}>
            {({navigate}) => (
              <MetricsCard
                {...commonMarketDataProps}
                onClick={navigate}
                clickableWrapperProps={{component: Link, to: marketDataLink}}
              />
            )}
          </WithNavigateTo>
        ) : (
          <MetricsCard {...commonMarketDataProps} />
        )}
      </GridItem>
      {config.showStakingData && (
        <GridItem>
          <WithNavigateTo to={stakePoolsLink}>
            {({navigate}) => (
              <MetricsCard
                className={classes.card}
                icon="pools"
                metric={translate(text.poolsLabel)}
                value={pools}
                onClick={navigate}
                clickableWrapperProps={{component: Link, to: stakePoolsLink}}
              />
            )}
          </WithNavigateTo>
        </GridItem>
      )}
    </Grid>
  )
}

export default compose(
  injectIntl,
  withStyles(styles)
)(OverviewMetrics)
