// @flow
import React from 'react'
import gql from 'graphql-tag'

import MetricsCard from '../../components/visual/MetricsCard'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import {getIntlFormatters} from '../../i18n/helpers'
import Searchbar from '../../components/visual/Searchbar'

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
})

// TODO: replace with idx
// https://github.com/facebookincubator/idx
const idx = (value, getter) => {
  try {
    return getter(value)
  } catch (err) {
    return null
  }
}

const _Status = ({intl, data}) => {
  const {translate, formatInt, formatPercent, formatFiat} = getIntlFormatters(intl)
  const status = data.currentStatus

  const NA = translate(text.not_available)

  const epochNumber = formatInt(idx(status, (s) => s.epochNumber), NA)
  const blockCount = formatInt(idx(status, (s) => s.blockCount), NA)
  const decentralization = formatPercent(idx(status, (s) => s.decentralization), NA)
  const price = formatFiat(idx(status, (s) => s.price.usd), 'USD', NA)
  const pools = formatInt(idx(status, (s) => s.stakePoolCount), NA)

  return (
    <div className="gradient-bg">
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <MetricsCard icon="epoch" metric={translate(text.epochLabel)} value={epochNumber} />
        <MetricsCard icon="blocks" metric={translate(text.blocksLabel)} value={blockCount} />
        <MetricsCard
          icon="decentralization"
          metric={translate(text.decentralizationLabel)}
          value={decentralization}
        />
        <MetricsCard icon="price" metric={translate(text.priceLabel)} value={price} />
        <MetricsCard icon="pools" metric={translate(text.poolsLabel)} value={pools} />
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Searchbar />
      </div>
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

const OverviewMetrics = compose(
  injectIntl,
  withOverviewMetricsData
)(_Status)

const Blockchain = () => {
  return (
    <React.Fragment>
      <h1>Home</h1>
      <OverviewMetrics />
    </React.Fragment>
  )
}

export default Blockchain
