// @flow
import React from 'react'
import {Typography, Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {SearchbarRefProvider, useSearchbarRef} from '../context/searchbarRef'

import OverviewMetrics from './OverviewMetrics'
import Search from './Search'
import {useI18n} from '@/i18n/helpers'
import {isCrawler} from '@/helpers/userAgent'

const messages = defineMessages({
  header: 'Ada Blockchain Explorer',
})

const useStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  wrapper: {
    background: palette.gradient,
  },
  metricsWrapper: {
    marginTop: spacing(5),
    marginBottom: spacing(5),
    [breakpoints.up('sm')]: {
      marginBottom: 0,
    },
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
}))

const BlockchainHeader = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const searchbarRef = useSearchbarRef()
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

            <Grid item className={classes.metricsWrapper} xs={12}>
              <OverviewMetrics />
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={10} md={8} lg={6} className="w-100">
          <Grid container direction="column" alignItems="stretch" className={classes.searchWrapper}>
            <Typography variant="h1" align="center">
              {tr(messages.header)}
            </Typography>
            <Hidden smDown>{!isCrawler && <Search />}</Hidden>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default () => (
  <SearchbarRefProvider>
    <BlockchainHeader />
  </SearchbarRefProvider>
)
