// @flow

import React from 'react'
import cn from 'classnames'
import moment from 'moment'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useBackendSyncingStatus} from '@/components/hooks/useBackendSyncingStatus'
import SyncingAlertIcon from '@/assets/icons/syncing-alert.svg'

const text = defineMessages({
  title: 'We are facing syncing issues on the server:',
  dataUpTo: 'Displaying blockchain data up to {date}',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    // TODO: do we want to create next theme gradient to fit design?
    backgroundImage: `linear-gradient(97deg, ${theme.palette.primary.main} 0%, ${fade(
      theme.palette.primary.main,
      0.2
    )} 100%)`,
    padding: theme.spacing.unit * 1.5,
  },
  text: {
    color: theme.palette.background.paper,
  },
  paddedRight: {
    paddingRight: theme.spacing.unit,
  },
}))

export default () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  // TODO: do we want to handle error here in any way?
  const {isBehind, syncedUpTo} = useBackendSyncingStatus()

  if (!isBehind) return null

  return (
    <Grid
      className={classes.wrapper}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <img alt="" src={SyncingAlertIcon} className={classes.paddedRight} />
      <Typography variant="overline" className={cn(classes.text, classes.paddedRight)}>
        {tr(text.title)}
      </Typography>
      <Typography variant="caption" className={classes.text}>
        {tr(text.dataUpTo, {date: moment(syncedUpTo)})}
      </Typography>
    </Grid>
  )
}
