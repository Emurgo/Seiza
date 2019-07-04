// @flow

import _ from 'lodash'
import React, {useCallback, useState} from 'react'
import useReactRouter from 'use-react-router'
import moment from 'moment-timezone'
import {defineMessages} from 'react-intl'

import {
  IconButton,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core'
import {Share, CallMade, CallReceived} from '@material-ui/icons'

import CopyToClipboard from '@/components/common/CopyToClipboard'
import FileInputHandler from '@/components/common/FileInputHandler'
import {Button} from '@/components/visual'
import {download} from '@/helpers/utils'
import {useI18n} from '@/i18n/helpers'

import {useSelectedPoolsContext} from '../../context/selectedPools'

const messages = defineMessages({
  share: 'Share',
  import: 'Import',
  export: 'Export',
  errorTitle: 'Could not load stake pools!',
  errorDesc: 'Stake pools could not be imported. Please make sure that the file is not corrupted.',
  errorClose: 'Close',
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

const exportPoolsToJson = (poolsData) => {
  const data = {
    type: 'seiza-pool-export:1',
    // ISO 8601 which relative to UTC
    export_time: moment().format(),
    pools: poolsData,
  }

  download('data.json', toPrettyJSON(data))
}

const ErrorDialog = ({onClose, open}) => {
  const {translate: tr} = useI18n()
  return (
    <Dialog {...{open, onClose}}>
      <DialogTitle>{tr(messages.errorTitle)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{tr(messages.errorDesc)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{tr(messages.errorClose)}</Button>
      </DialogActions>
    </Dialog>
  )
}

type Props = {|
  selectedPools: Array<{name: string, poolHash: string}>,
|}

const ActionsBar = ({selectedPools}: Props) => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()
  const [showError, setShowError] = useState(false)

  const onCloseErrorDialog = useCallback(() => setShowError(false), [setShowError])
  const {setPools} = useSelectedPoolsContext()
  const setImportedPools = useCallback(
    (data) => {
      let pools = []
      try {
        pools = JSON.parse(data).pools.map(({hash}) => {
          if (!_.isString(hash)) throw new Error('Invalid hash format')
          return hash
        })
        setPools(pools)
      } catch (e) {
        setShowError(true)
      }
    },
    [setPools]
  )

  // Note: not using `window.location.href` as then the component would not properly
  // listen to changes in url query
  const currentUrl = process.browser ? window.location.origin + history.createHref(location) : ''

  const downloadSelectedPools = useCallback(
    () => exportPoolsToJson(selectedPools.map((p) => ({name: p.name, hash: p.poolHash}))),
    [selectedPools]
  )

  return (
    <React.Fragment>
      <ErrorDialog open={showError} onClose={onCloseErrorDialog} />
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
          <FileInputHandler id="import-staking-settings" onFileLoaded={setImportedPools}>
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
    </React.Fragment>
  )
}

export default ActionsBar
