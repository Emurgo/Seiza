// @flow
import React from 'react'
import {Typography, createStyles, withStyles, Grid, Hidden} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import OverviewMetrics from './OverviewMetrics'
import Search from './Search'
import {withI18n} from '@/i18n/helpers'
import {isCrawler} from '@/helpers/userAgent'
import {useSearchbarRefContext} from '@/components/context/SearchbarRef'

const messages = defineMessages({
  header: 'Ada Blockchain Explorer',
})

const styles = ({palette, spacing}) =>
  createStyles({
    wrapper: {
      background: palette.gradient,
    },
    metricsWrapper: {
      marginTop: spacing(5),
      marginBottom: spacing(5),
    },
    searchWrapper: {
      'marginLeft': 'auto',
      'marginRight': 'auto',
      'marginBottom': spacing(6.5),
      '& > *': {
        marginTop: spacing(1.25),
        marginBottom: spacing(1.25),
      },
    },
  })

const BlockchainHeader = ({classes, i18n: {translate}}) => {
  const searchbarRef = useSearchbarRefContext()
  return (
    <div className={classes.wrapper}>
      <Grid
        container
        direction="column"
        justify="space-around"
        alignItems="center"
        className={classes.wrapper}
      >
        {!isCrawler && (
          <React.Fragment>
            <Hidden mdUp>
              <Grid item>
                <div ref={searchbarRef} />
              </Grid>
            </Hidden>

            <Grid item className={classes.metricsWrapper}>
              <OverviewMetrics />
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={10} md={8} lg={6} className="w-100">
          <Grid container direction="column" alignItems="stretch" className={classes.searchWrapper}>
            <Typography variant="h1" align="center">
              {translate(messages.header)}
            </Typography>
            <Hidden smDown>{!isCrawler && <Search />}</Hidden>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default compose(
  withI18n,
  withStyles(styles)
)(BlockchainHeader)
