// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withStateHandlers} from 'recompose'
import {graphql} from 'react-apollo'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import MetricsCard from '@/components/visual/MetricsCard'
import {getIntlFormatters} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import WithNavigateTo from '@/components/headless/navigateTo'

const text = defineMessages({
  not_available: {
    id: 'overview.metrics.not_available',
    defaultMessage: 'N/A',
  },
  epochLabel: {
    id: 'overview.metrics.epoch.label',
    defaultMessage: 'Epoch',
  },
  blocksLabel: {
    id: 'overview.metrics.blocks.label',
    defaultMessage: 'Blocks',
  },
  decentralizationLabel: {
    id: 'overview.metrics.decentralization.label',
    defaultMessage: 'Decentralization',
  },
  priceLabel: {
    id: 'overview.metrics.price.label',
    defaultMessage: 'Price',
  },
  poolsLabel: {
    id: 'overview.metrics.poolCount.label',
    defaultMessage: 'Pools',
  },
  searchPlaceholder: {
    id: 'overview.search.placeholder',
    defaultMessage: 'Search addresses, epochs & slots on the Cardano network',
  },
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
  const status = data.currentStatus

  const NA = translate(text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.epochNumber), {defaultValue: NA})
  const blockCount = formatInt(idx(status, (s) => s.blockCount), {defaultValue: NA})
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), {defaultValue: NA})
  const price = formatFiat(idx(status, (s) => s.price), {currency, defaultValue: NA})
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), {defaultValue: NA})

  return (
    <Grid container justify="center" wrap="wrap" direction="row">
      <Grid item className={classes.cardDimensions}>
        <WithNavigateTo to={status && routeTo.epoch(status.epochNumber)}>
          {({navigate}) => (
            <MetricsCard
              className={classes.card}
              icon="epoch"
              metric={translate(text.epochLabel)}
              value={epochNumber}
              onClick={navigate}
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
        <WithNavigateTo to={routeTo.more()}>
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
            />
          )}
        </WithNavigateTo>
      </GridItem>
      <GridItem>
        <WithNavigateTo to={routeTo.staking.home()}>
          {({navigate}) => (
            <MetricsCard
              className={classes.card}
              icon="pools"
              metric={translate(text.poolsLabel)}
              value={pools}
              onClick={navigate}
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
