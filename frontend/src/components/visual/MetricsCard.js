// @flow
import React from 'react'
import Card from '@material-ui/core/Card'

import IconEpoch from './tmp_assets/MetricsCard-icon-epoch.png'
import IconBlocks from './tmp_assets/MetricsCard-icon-blocks.png'
import IconDecentralization from './tmp_assets/MetricsCard-icon-decentralization.png'
import IconPrice from './tmp_assets/MetricsCard-icon-price.png'
import IconPools from './tmp_assets/MetricsCard-icon-pools.png'

import styles from './MetricsCard.module.scss'

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

const MetricsCard = ({metric, value, icon}: PropTypes) => (
  <Card className={styles.card}>
    <img src={ICONS[icon]} />
    <div className={styles.inner}>
      <div className={styles.value}>{value}</div>
      <div className={styles.metric}>{metric}</div>
    </div>
  </Card>
)

export default MetricsCard
