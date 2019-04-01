// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withStateHandlers} from 'recompose'
import {graphql} from 'react-apollo'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import {MetricsCard, LoadingDots} from '@/components/visual'
import {getIntlFormatters} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import WithNavigateTo from '@/components/headless/navigateTo'
import {Link} from 'react-router-dom'

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
      marginRight: '20px',
      marginLeft: '20px',
    },
  })

const GridItem = withStyles(styles)(({children, classes}) => (
  <Grid item className={classes.cardDimensions}>
    {children}
  </Grid>
))

const OverviewMetrics = ({intl, data, classes, currency, setCurrency}) => {
  const {translate, formatInt, formatPercent, formatFiat} = getIntlFormatters(intl)
  const {currentStatus: status, loading, error} = data

  const NA = loading ? <LoadingDots /> : translate(error ? text.error : text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.epochNumber), {defaultValue: NA})
  const blockCount = formatInt(idx(status, (s) => s.blockCount), {defaultValue: NA})
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), {defaultValue: NA})
  const price = formatFiat(idx(status, (s) => s.price), {currency, defaultValue: NA})
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), {defaultValue: NA})

  const epochLink = status && routeTo.epoch(status.epochNumber)
  const marketDataLink = routeTo.more()
  const stakePoolsLink = routeTo.staking.home()

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
        <MetricsCard
          className={classes.card}
          icon="blocks"
          metric={translate(text.blocksLabel)}
          value={blockCount}
        />
      </GridItem>
      <GridItem>
        <MetricsCard
          className={classes.card}
          icon="decentralization"
          metric={translate(text.decentralizationLabel)}
          value={decentralization}
        />
      </GridItem>
      <GridItem>
        <WithNavigateTo to={marketDataLink}>
          {({navigate}) => (
            <MetricsCard
              className={classes.card}
              icon="price"
              metric={translate(text.priceLabel)}
              value={price}
              onClick={navigate}
              options={[
                {
                  label: 'USD/ADA',
                  onClick: () => setCurrency('USD'),
                },
                {
                  label: 'EUR/ADA',
                  onClick: () => setCurrency('EUR'),
                },
                {
                  label: 'YEN/ADA',
                  onClick: () => setCurrency('JPY'),
                },
              ]}
              clickableWrapperProps={{component: Link, to: marketDataLink}}
            />
          )}
        </WithNavigateTo>
      </GridItem>
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
    </Grid>
  )
}

const OVERVIEW_METRICS_QUERY = gql`
  query($currency: CurrencyEnum!) {
    currentStatus {
      epochNumber
      blockCount
      decentralization
      price(currency: $currency)
      stakePoolCount
    }
  }
`

const STATUS_REFRESH_INTERVAL = 20 * 1000

const withOverviewMetricsData = graphql(OVERVIEW_METRICS_QUERY, {
  options: ({currency}) => ({
    pollInterval: STATUS_REFRESH_INTERVAL,
    variables: {
      currency,
    },
  }),
})

export default compose(
  injectIntl,
  withStyles(styles),
  withStateHandlers(
    {
      currency: 'USD',
    },
    {
      setCurrency: () => (currency) => ({currency}),
    }
  ),
  withOverviewMetricsData
)(OverviewMetrics)
