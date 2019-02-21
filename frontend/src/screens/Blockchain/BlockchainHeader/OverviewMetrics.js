// @flow
import React from 'react'
import gql from 'graphql-tag'
import idx from 'idx'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {createStyles, withStyles} from '@material-ui/core'

import MetricsCard from '@/components/visual/MetricsCard'
import {getIntlFormatters} from '@/i18n/helpers'

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
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    card: {
      width: '200px',
      marginRight: '20px',
      marginLeft: '20px',
    },
  })

const OverviewMetrics = ({intl, data, classes}) => {
  const {translate, formatInt, formatPercent, formatFiat} = getIntlFormatters(intl)
  const status = data.currentStatus

  const NA = translate(text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.epochNumber), {defaultValue: NA})
  const blockCount = formatInt(idx(status, (s) => s.blockCount), {defaultValue: NA})
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), {defaultValue: NA})
  const price = formatFiat(idx(status, (s) => s.price.usd), {currency: 'USD', defaultValue: NA})
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), {defaultValue: NA})

  return (
    <div className={classes.wrapper}>
      <MetricsCard
        className={classes.card}
        icon="epoch"
        metric={translate(text.epochLabel)}
        value={epochNumber}
      />
      <MetricsCard
        className={classes.card}
        icon="blocks"
        metric={translate(text.blocksLabel)}
        value={blockCount}
      />
      <MetricsCard
        className={classes.card}
        icon="decentralization"
        metric={translate(text.decentralizationLabel)}
        value={decentralization}
      />
      <MetricsCard
        className={classes.card}
        icon="price"
        metric={translate(text.priceLabel)}
        value={price}
      />
      <MetricsCard
        className={classes.card}
        icon="pools"
        metric={translate(text.poolsLabel)}
        value={pools}
      />
    </div>
  )
}

const OVERVIEW_METRICS_QUERY = gql`
  query {
    currentStatus {
      epochNumber
      blockCount
      decentralization
      price {
        usd
      }
      stakePoolCount
    }
  }
`

const STATUS_REFRESH_INTERVAL = 20 * 1000

const withOverviewMetricsData = graphql(OVERVIEW_METRICS_QUERY, {
  options: (props) => ({
    pollInterval: STATUS_REFRESH_INTERVAL,
  }),
})

export default compose(
  injectIntl,
  withStyles(styles),
  withOverviewMetricsData
)(OverviewMetrics)
