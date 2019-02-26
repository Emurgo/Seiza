import React from 'react'
import classnames from 'classnames'
import {compose} from 'redux'
import {Grid, Typography, createStyles, withStyles} from '@material-ui/core'

import {MetricsCard} from '@/components/visual'

// TODO: intl

const styles = () =>
  createStyles({
    wrapper: {
      height: '250px',
    },
    card: {
      maxWidth: '250px',
      marginLeft: '30px',
      marginRight: '30px',
    },
  })

const Header = ({classes}) => (
  <Grid
    container
    className={classnames(classes.wrapper, 'gradient-bg')}
    direction="column"
    justify="space-evenly"
    alignItems="center"
  >
    <Typography variant="h4">Explore Stake Pools</Typography>
    <Grid container direction="row" justify="center" alignItems="center">
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={'You can search for stake pool you like'}
      />
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={'You can download or share it'}
      />
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={'You can compare it by diff features'}
      />
    </Grid>
  </Grid>
)

export default compose(withStyles(styles))(Header)
