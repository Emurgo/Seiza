import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/components/context/googleAnalytics'

const messages = defineMessages({
  notFoundHeader: 'We are sorry!',
  notFound: 'The requested url could not be found',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    padding: theme.spacing(6),
  },
  message: {
    marginBottom: theme.spacing(3),
  },
  image: {
    maxWidth: '100%',
  },
}))

const PageNotFound = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('404')

  return (
    <Grid
      className={classes.wrapper}
      container
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Typography className={classes.message} variant="h2">
        {tr(messages.notFoundHeader)}
      </Typography>
      <Typography className={classes.message} variant="h4">
        {tr(messages.notFound)}
      </Typography>
      <img src="/static/assets/error-screen.svg" alt="" className={classes.image} />
    </Grid>
  )
}

export default PageNotFound
