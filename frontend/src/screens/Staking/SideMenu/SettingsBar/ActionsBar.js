// @flow

import React from 'react'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'

import {IconButton, Grid, Typography} from '@material-ui/core'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import CopyToClipboard from '@/components/common/CopyToClipboard'
import FileInputHandler from '@/components/common/FileInputHandler'
import {download} from '@/helpers/utils'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  share: 'Share',
  import: 'Import',
  export: 'Export',
})

const ActionButton = ({
  label,
  icon,
  onClick,
}: {
  label: string,
  icon: React$Node,
  onClick?: Function,
}) => (
  <Grid container direction="row" alignItems="center">
    <Grid item>
      {/* Note: `component="span"` is required so that this can be used
          as a children of `ReadFile` */}
      <IconButton component="span" aria-label={label} color="primary" onClick={onClick}>
        {icon}
      </IconButton>
    </Grid>
    <Grid item>
      <Typography color="textSecondary" variant="overline">
        {label}
      </Typography>
    </Grid>
  </Grid>
)

type Props = {|
  selectedPoolsHashes: Array<string>,
|}

const ActionsBar = ({selectedPoolsHashes}: Props) => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // Note: not using `window.location.href` as then the component would not properly
  // listen to changes in url query
  const currentUrl = process.browser ? window.location.origin + history.createHref(location) : ''

  return (
    <Grid container direction="row" alignItems="center" justify="space-between" wrap="nowrap">
      <Grid item>
        <ActionButton
          label={tr(messages.share)}
          icon={
            // Note(ppershing): this is a temporary workaround
            // as tooltip somehow messes up line height
            <div style={{height: '1em'}}>
              <CopyToClipboard value={currentUrl}>
                <Share color="primary" />
              </CopyToClipboard>
            </div>
          }
        />
      </Grid>
      <Grid item>
        <FileInputHandler
          id="import-staking-settings"
          onFileLoaded={(content) => {
            // TODO: next PR
            console.log('File loaded:', content) // eslint-disable-line
          }}
        >
          <ActionButton label={tr(messages.import)} icon={<CallReceived color="primary" />} />
        </FileInputHandler>
      </Grid>
      <Grid item>
        <ActionButton
          label={tr(messages.export)}
          icon={<CallMade color="primary" />}
          onClick={() => {
            // TODO: next PR
            download('data.json', JSON.stringify(selectedPoolsHashes))
          }}
        />
      </Grid>
    </Grid>
  )
}

export default ActionsBar
