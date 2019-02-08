// @flow

import React from 'react'

import IconEpoch from './tmp_assets/MetricsCard-icon-epoch.png'
import IconBlocks from './tmp_assets/MetricsCard-icon-blocks.png'
import IconDecentralization from './tmp_assets/MetricsCard-icon-decentralization.png'
import IconPrice from './tmp_assets/MetricsCard-icon-price.png'
import IconPools from './tmp_assets/MetricsCard-icon-pools.png'

const ICONS = {
  epoch: IconEpoch,
  blocks: IconBlocks,
  decentralization: IconDecentralization,
  price: IconPrice,
  pools: IconPools,
}

type PropTypes = {
  metric: string,
  value: string,
  icon: $Keys<typeof ICONS>,
}

const styles = {
  card: {
    border: 'solid 1px gray',
    width: '150px',
    height: '50px',
    display: 'flex',
    padding: '5px',
    margin: '5px',
    flexDirection: 'row',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  value: {fontSize: 20, textAlign: 'center'},
  metric: {color: 'gray', textAlign: 'center'},
}

const MetricsCard = ({metric, value, icon}: PropTypes) => (
  <div style={styles.card}>
    <img src={ICONS[icon]} />
    <div style={styles.inner}>
      <div style={styles.value}>{value}</div>
      <div style={styles.metric}>{metric}</div>
    </div>
  </div>
)

export default MetricsCard
