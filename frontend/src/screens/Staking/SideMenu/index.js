// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
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
  panel: {
    height: 80,
    paddingRight: 40,
    paddingLeft: 60,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
  },
  iconButton: {
    width: '100%',
    borderRadius: 0,
    background: theme.palette.background.paper,
    padding: 0,
  },
  autoSync: {
    background: theme.palette.background.paper,
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

  if (isMobile) return <NavigationBar />

  return (
    <Card className={classes.wrapper}>
      <Grid container className={cn(classes.autoSync, classes.panel)} alignItems="center">
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
        <Grid container className={classes.panel} alignItems="center">
          <Grid container alignItems="center" direction="row">
            <Refresh />
            &nbsp;&nbsp;
            <Typography color="textSecondary" variant="overline">
              {tr(messages.reset)}
            </Typography>
          </Grid>
        </Grid>
      </IconButton>
      <SettingsBar />
      <NavigationBar />
    </Card>
  )
}

export default SideMenu
