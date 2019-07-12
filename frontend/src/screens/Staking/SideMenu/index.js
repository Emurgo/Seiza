// @flow

import React, {useCallback} from 'react'
import cn from 'classnames'
import ReactMarkdown from 'react-markdown'
import useReactRouter from 'use-react-router'
import {Typography, Grid, Switch} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import SettingsBar from './SettingsBar'
import NavigationBar from './NavigationBar'
import {useI18n} from '@/i18n/helpers'
import {Card, Tooltip} from '@/components/visual'
import {Link} from '@/components/common'
import {useAutoSyncContext} from '../context/autoSync'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const messages = defineMessages({
  autoSync: 'Auto-save',
  openSaved: 'Open saved settings',
  openSavedTooltip:
    'Will **open current page** in a **new tab** with filters and selected pools reflecting **saved settings**.',
  autoSaveTooltip:
    'When **turned on**, selected pools or filter changes will be **saved locally**.<br/>When **turned off**, those changes will **not be saved**.<br/>After turning the switch off and making changes, you can restore to previously saved settings by clicking on **Open saved settings** link which will open saved settings in a new tab.',
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
      <SettingsBar />
      <NavigationBar />
    </Card>
  )
}

export default SideMenu
