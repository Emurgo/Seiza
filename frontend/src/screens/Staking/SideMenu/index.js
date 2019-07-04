// @flow

import React, {useCallback} from 'react'
import useReactRouter from 'use-react-router'
import {IconButton, Typography, Grid, Switch, FormControlLabel} from '@material-ui/core'
import {Refresh} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import SettingsBar from './SettingsBar'
import NavigationBar from './NavigationBar'
import {useI18n} from '@/i18n/helpers'
import {Card} from '@/components/visual'
import {Link} from '@/components/common'
import {useResetUrlAndStorage} from '../context'
import {useAutoSyncContext} from '../context/autoSync'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const messages = defineMessages({
  reset: 'Reset all settings',
  autoSync: 'Auto-save',
  openSaved: 'Open saved settings',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
  },
  iconButton: {
    width: '100%',
    padding: '20px 40px 20px 60px',
    borderRadius: 0,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
    background: theme.palette.background.paper,
  },
  autoSync: {
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
    background: theme.palette.background.paper,
    padding: '5px 40px 5px 60px',
  },
  link: {
    textDecoration: 'none',
  },
  linkText: {
    textDecoration: 'underline',
  },
}))

const SideMenu = () => {
  const {match} = useReactRouter()
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const resetUrlAndStorage = useResetUrlAndStorage()
  const onReset = useCallback(() => resetUrlAndStorage(), [resetUrlAndStorage])
  const {autoSync, toggleAutoSync} = useAutoSyncContext()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <React.Fragment>
        <SettingsBar />
        <NavigationBar />
      </React.Fragment>
    )
  }

  return (
    <Card className={classes.wrapper}>
      <Grid container className={classes.autoSync} alignItems="center">
        <FormControlLabel
          control={<Switch color="primary" checked={!!autoSync} onChange={toggleAutoSync} />}
          label={tr(messages.autoSync)}
        />
        <Link to={{pathname: match.url}} target="_blank" className={classes.link}>
          <Typography className={classes.linkText}>{tr(messages.openSaved)}</Typography>
        </Link>
        {/* Link to show current saved settings in same tab? */}
      </Grid>
      <IconButton
        onClick={onReset}
        aria-label="Reset settings"
        className={classes.iconButton}
        color="primary"
      >
        <Grid container alignItems="center" direction="row">
          <Refresh />
          &nbsp;&nbsp;
          <Typography color="textSecondary" variant="overline">
            {tr(messages.reset)}
          </Typography>
        </Grid>
      </IconButton>
      <SettingsBar />
      <NavigationBar />
    </Card>
  )
}

export default SideMenu
