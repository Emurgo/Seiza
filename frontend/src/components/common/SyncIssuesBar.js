// @flow

import React from 'react'
import cn from 'classnames'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useBackendSyncingStatus} from '@/hooks/useBackendSyncingStatus'
import SyncingAlertIcon from '@/assets/icons/syncing-alert.svg'

const text = defineMessages({
  title: 'We are facing syncing issues on the server:',
  dataUpTo: 'Displaying blockchain data up to {date}',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundImage: theme.palette.buttonsGradient.normal,
    padding: theme.spacing.unit * 1.5,
  },
  text: {
    color: theme.palette.background.paper,
  },
  mainText: {
    fontWeight: 700,
  },
  dataUpTo: {
    fontSize: theme.typography.fontSize * 0.875,
  },
  paddedRight: {
    paddingRight: theme.spacing.unit,
  },
}))

export default () => {
  const {translate: tr, formatTimestamp} = useI18n()
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
      <Typography
        variant="overline"
        className={cn(classes.text, classes.mainText, classes.paddedRight)}
      >
        {tr(text.title)}
      </Typography>
      <Typography variant="caption" className={cn(classes.text, classes.dataUpTo)}>
        {tr(text.dataUpTo, {date: formatTimestamp(syncedUpTo)})}
      </Typography>
    </Grid>
  )
}
