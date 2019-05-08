// @flow

import React from 'react'
import {makeStyles} from '@material-ui/styles'

import PageNotFound from '../PageNotFound'
import analytics from '@/helpers/googleAnalytics'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: 300,
  },
}))

// Note: using grid setup it is tricky to center PageNotFound when
// we want 'BlockchainHeader' to be rendered.
// For now using simpler, not perfect styling solution.
export default () => {
  const classes = useStyles()

  analytics.useTrackPageVisitEvent('404-blockchain')

  return (
    <div className={classes.wrapper}>
      <PageNotFound />
    </div>
  )
}
