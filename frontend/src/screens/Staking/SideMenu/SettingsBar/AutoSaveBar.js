// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import ReactMarkdown from 'react-markdown'
import useReactRouter from 'use-react-router'
import cn from 'classnames'
import {Typography, Grid, Switch, FormControlLabel} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Tooltip} from '@/components/visual'
import {Link} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {useAutoSyncContext} from '../../context/autoSync'

const messages = defineMessages({
  autoSync: 'Auto-save',
  openSaved: 'Open saved settings',
  openSavedTooltip:
    'Will **open current page** in a **new tab** with filters and selected pools reflecting **saved settings**.',
  autoSaveTooltip:
    'When **turned on**, selected pools or filter changes will be **saved locally**.<br/>When **turned off**, those changes will **not be saved**.<br/>After turning the switch off and making changes, you can restore to previously saved settings by clicking on **Open saved settings** link which will open saved settings in a new tab.',
})

// Note: '\n\n' seems work also for Edge on Windows
const replaceBreak = (content: string): string => content.replace(/<br\/>/g, '\n\n')

const renderers = {
  paragraph: ({children}) => <Typography variant="body1">{children}</Typography>,
}

const Markdown = ({source}: {source: string}) => (
  <ReactMarkdown source={replaceBreak(source)} renderers={renderers} />
)

const useStyles = makeStyles((theme) => ({
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

const AutoSaveBar = ({className}: {+className?: ?string}) => {
  const classes = useStyles()
  const {match} = useReactRouter()
  const {translate: tr} = useI18n()
  const {autoSync, toggleAutoSync} = useAutoSyncContext()
  return (
    <Grid container className={cn(classes.autoSync, className)} alignItems="center">
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
  )
}

export default AutoSaveBar
