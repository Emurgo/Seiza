import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/helpers/googleAnalytics'
import errorImage from '@/assets/error-screen.svg'

const messages = defineMessages({
  notFoundHeader: 'We are sorry!',
  notFound: 'The requested url could not be found',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    padding: theme.spacing.unit * 6,
  },
  message: {
    marginBottom: theme.spacing.unit * 3,
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
      <img src={errorImage} alt="" />
    </Grid>
  )
}

export default PageNotFound
