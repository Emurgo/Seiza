// @flow
import React from 'react'
import Card from '@material-ui/core/Card'
import {withStyles, createStyles} from '@material-ui/core'

import IconEpoch from './tmp_assets/MetricsCard-icon-epoch.png'
import IconBlocks from './tmp_assets/MetricsCard-icon-blocks.png'
import IconDecentralization from './tmp_assets/MetricsCard-icon-decentralization.png'
import IconPrice from './tmp_assets/MetricsCard-icon-price.png'
import IconPools from './tmp_assets/MetricsCard-icon-pools.png'

const styles = (theme) => createStyles({
  card: {
    minWidth: '150px',
    minHeight: '50px',
    display: 'flex',
    padding: '5px',
    margin: '5px',
    flexDirection: 'row',
    boxShadow: 'none',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
  },
  metric: {
    color: 'grey',
  },
})

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
  classes: any,
}

const MetricsCard = ({metric, value, icon, classes}: PropTypes) => (
  <Card className={classes.card}>
    <img src={ICONS[icon]} />
    <div className={classes.inner}>
      <div className={classes.value}>{value}</div>
      <div className={classes.metric}>{metric}</div>
    </div>
  </Card>
)

export default withStyles(styles)(MetricsCard)
