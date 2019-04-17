// @flow
import React from 'react'
import {Typography, createStyles, withStyles, Grid} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import OverviewMetrics from './OverviewMetrics'
import Search from './Search'
import {withI18n} from '@/i18n/helpers'

const messages = defineMessages({
  header: 'Ada Blockchain Explorer',
})

const styles = ({palette, spacing}) =>
  createStyles({
    wrapper: {
      background: palette.gradient,
    },
    metricsWrapper: {
      marginTop: spacing.unit * 5,
      marginBottom: spacing.unit * 5,
    },
    searchWrapper: {
      'marginLeft': 'auto',
      'marginRight': 'auto',
      'marginBottom': spacing.unit * 6.5,
      '& > *': {
        marginTop: spacing.unit * 1.25,
        marginBottom: spacing.unit * 1.25,
      },
    },
  })

const BlockchainHeader = ({classes, i18n: {translate}}) => (
  <div className={classes.wrapper}>
    <Grid
      container
      direction="column"
      justify="space-around"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item className={classes.metricsWrapper}>
        <OverviewMetrics />
      </Grid>

      <Grid item xs={10} md={8} lg={6}>
        <Grid container direction="column" alignItems="stretch" className={classes.searchWrapper}>
          <Typography variant="h1" align="center">
            {translate(messages.header)}
          </Typography>
          <Search />
        </Grid>
      </Grid>
    </Grid>
  </div>
)

export default compose(
  withI18n,
  withStyles(styles)
)(BlockchainHeader)
