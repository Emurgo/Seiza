// @flow

import React, {useCallback} from 'react'
import useReactRouter from 'use-react-router'
import moment from 'moment-timezone'
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

const toPrettyJSON = (data) => JSON.stringify(data, null, 4)

const exportPoolsToJson = (selectedPoolsHashes) => {
  const data = {
    type: 'seiza-pool-export:1',
    // TODO: what format do we want? This is ISO 8601 which relative to UTC
    export_time: moment().format(),
    pools: selectedPoolsHashes,
    check: 'TODO',
  }

  download('data.json', toPrettyJSON(data))
}

type Props = {|
  selectedPoolsHashes: Array<string>,
|}

const ActionsBar = ({selectedPoolsHashes}: Props) => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // Note: not using `window.location.href` as then the component would not properly
  // listen to changes in url query
  const currentUrl = process.browser ? window.location.origin + history.createHref(location) : ''

  const downloadSelectedPools = useCallback(() => exportPoolsToJson(selectedPoolsHashes), [
    selectedPoolsHashes,
  ])

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
          onClick={downloadSelectedPools}
        />
      </Grid>
    </Grid>
  )
}

export default ActionsBar
