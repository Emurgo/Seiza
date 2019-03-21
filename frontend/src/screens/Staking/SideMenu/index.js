// @flow

import React, {useCallback} from 'react'

import {IconButton, Typography, Grid} from '@material-ui/core'
import {Refresh} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import PoolsToCompare from './PoolsToCompare'
import NavigationBar from './NavigationBar'
import {useResetUrlAndStorage} from '../context'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  reset: 'Reset all settings',
})

const useStyles = makeStyles((theme) => ({
  iconButton: {
    width: '100%',
    padding: '20px 40px 20px 60px',
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
    background: theme.palette.background.paper,
  },
}))

const SideMenu = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const resetUrlAndStorage = useResetUrlAndStorage()
  const onReset = useCallback(() => resetUrlAndStorage(), [resetUrlAndStorage])

  return (
    <React.Fragment>
      <IconButton onClick={onReset} aria-label="Reset settings" className={classes.iconButton}>
        <Grid container alignItems="center" direction="row">
          <Refresh />
          &nbsp;&nbsp;
          <Typography variant="overline">{tr(messages.reset)}</Typography>
        </Grid>
      </IconButton>
      <PoolsToCompare />
      <NavigationBar />
    </React.Fragment>
  )
}

export default SideMenu
