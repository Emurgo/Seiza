// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
import ReactMarkdown from 'react-markdown'
import useReactRouter from 'use-react-router'
import {IconButton, Typography, Grid, Switch, FormControlLabel} from '@material-ui/core'
import {Refresh} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import SettingsBar from './SettingsBar'
import NavigationBar from './NavigationBar'
import {useI18n} from '@/i18n/helpers'
import {Card, Tooltip} from '@/components/visual'
import {Link, ConfirmationDialog} from '@/components/common'
import useModalState from '@/components/hooks/useModalState'
import {useResetUrlAndStorage} from '../context'
import {useAutoSyncContext} from '../context/autoSync'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const messages = defineMessages({
  reset: 'Reset all settings',
  autoSync: 'Auto-save',
  openSaved: 'Open saved settings',
  openSavedTooltip:
    'Will **open current page** in a **new tab** with filters and selected pools reflecting **saved settings**.',
  autoSaveTooltip:
    'When **turned on**, selected pools or filter changes will be **saved locally**.<br/>When **turned off**, those changes will **not be saved**.<br/>After turning the switch off and making changes, you can restore to previously saved settings by clicking on **Open saved settings** link which will open saved settings in a new tab.',
  resetConfirmTitle: 'Are you sure you want to reset all settings?',
  resetConfirmMessage:
    'Removes selected pools and resets all filters to defaults within staking simulator.',
  resetActionButton: 'Reset',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    overflow: 'visible', // Note: sticky navigation is not working without this
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

// Note: '\n\n' seems work also for Edge on Windows
const replaceBreak = (content: string): string => content.replace(/<br\/>/g, '\n\n')

const renderers = {
  paragraph: ({children}) => <Typography variant="body1">{children}</Typography>,
}

const Markdown = ({source}: {source: string}) => (
  <ReactMarkdown source={replaceBreak(source)} renderers={renderers} />
)

const ResetButton = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const resetUrlAndStorage = useResetUrlAndStorage()
  const {isOpen, openModal, closeModal} = useModalState()
  const onReset = useCallback(() => {
    resetUrlAndStorage()
    closeModal()
  }, [closeModal, resetUrlAndStorage])
  return (
    <React.Fragment>
      <IconButton
        onClick={openModal}
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

      <ConfirmationDialog
        title={tr(messages.resetConfirmTitle)}
        message={tr(messages.resetConfirmMessage)}
        confirmationButtonText={tr(messages.resetActionButton)}
        open={isOpen}
        onCancel={closeModal}
        onConfirm={onReset}
      />
    </React.Fragment>
  )
}

const SideMenu = () => {
  const {match} = useReactRouter()
  const classes = useStyles()
  const {translate: tr} = useI18n()
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
      <Grid container className={cn(classes.autoSync, classes.panel)} alignItems="center">
        <Tooltip
          title={<Markdown source={tr(messages.autoSaveTooltip)} />}
          placement="bottom"
          interactive
        >
          <FormControlLabel
            control={<Switch color="primary" checked={!!autoSync} onChange={toggleAutoSync} />}
            label={tr(messages.autoSync)}
          />
        </Tooltip>
        <Tooltip
          title={<Markdown source={tr(messages.openSavedTooltip)} />}
          placement="bottom"
          interactive
        >
          {/* Note: Tooltip not working without that <div /> */}
          <div>
            <Link to={{pathname: match.url}} target="_blank" className={classes.link}>
              <Typography className={classes.linkText}>{tr(messages.openSaved)}</Typography>
            </Link>
          </div>
        </Tooltip>
        {/* Link to show current saved settings in same tab? */}
      </Grid>
      <ResetButton />

      <SettingsBar />
      <NavigationBar />
    </Card>
  )
}

export default SideMenu
