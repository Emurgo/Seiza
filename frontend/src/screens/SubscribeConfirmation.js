import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/components/context/googleAnalytics'
import subscribedImage from '@/static/assets/icons/subscribed.svg'
import {useSubscribeContext} from './Footer/context/subscribe'

const messages = defineMessages({
  subscriptionConfirmedHeader: 'Thank you!',
  subscriptionConfirmedMessage: 'Your subscription to our newsletter has been confirmed.',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    padding: theme.spacing(6),
  },
  message: {
    marginBottom: theme.spacing(3),
  },
}))

const SubscribeConfirmation = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {hideSubscribe} = useSubscribeContext()
  React.useEffect(hideSubscribe, [])

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('ActiveCampaign')

  return (
    <Grid
      className={classes.wrapper}
      container
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Typography className={classes.message} variant="h2">
        {tr(messages.subscriptionConfirmedHeader)}
      </Typography>
      <Typography className={classes.message} variant="h4">
        {tr(messages.subscriptionConfirmedMessage)}
      </Typography>
      <img src={subscribedImage} alt="" />
    </Grid>
  )
}

export default SubscribeConfirmation
