// @flow

import _ from 'lodash'
import CRC32 from 'crc-32'
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
import {ReactComponent as ShareIcon} from '@/static/assets/icons/staking-simulator/share.svg'
import {ReactComponent as ImportIcon} from '@/static/assets/icons/staking-simulator/import.svg'
import {ReactComponent as ExportIcon} from '@/static/assets/icons/staking-simulator/export.svg'

import {CopyToClipboard, FileInputHandler, ConfirmationDialog} from '@/components/common'
import useModalState from '@/components/hooks/useModalState'
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
  confirmTitle: 'File change detected',
  confirmMessage:
    'The content of the file has changed since export. Do you want to import it anyway?',
  confirmButton: 'Import',
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

const addCRC = (dataObj) => {
  const crc32Value = CRC32.str(JSON.stringify(dataObj))
  return {
    ...dataObj,
    check: crc32Value,
  }
}

const validateCRCData = (dataObjWithCrc) => {
  const data = _.omit(dataObjWithCrc, 'check')
  return CRC32.str(JSON.stringify(data)) === dataObjWithCrc.check
}

const validPoolHashes = (poolsHashes) => !poolsHashes.some((hash) => !_.isString(hash))

const exportPoolsToJson = (poolsData) => {
  const data = {
    type: 'seiza-pool-export:1',
    // ISO 8601 which relative to UTC
    export_time: moment().format(),
    pools: poolsData,
  }

  download('data.json', toPrettyJSON(addCRC(data)))
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

const ImportPools = () => {
  const {translate: tr} = useI18n()

  const [showError, setShowError] = useState(false)
  const [poolsToConfirm, setPoolsToConfirm] = useState(null)

  const {
    isOpen: isConfirmationModalOpen,
    closeModal: closeConfirmationModal,
    openModal: openConfirmationModal,
  } = useModalState()
  const {setPools} = useSelectedPoolsContext()

  const onConfirmImport = useCallback(() => {
    setPools(poolsToConfirm)
    setPoolsToConfirm(null)
    closeConfirmationModal()
  }, [closeConfirmationModal, poolsToConfirm, setPools])

  const onCloseErrorDialog = useCallback(() => setShowError(false), [setShowError])

  const setImportedPools = useCallback(
    (dataStr) => {
      try {
        const data = JSON.parse(dataStr)
        const {pools} = data

        const poolsHashes = pools.map(({hash}) => hash)
        if (!validPoolHashes(poolsHashes)) throw new Error('Invalid hash format')

        if (!validateCRCData(data)) {
          setPoolsToConfirm(poolsHashes)
          openConfirmationModal()
          return
        }

        setPools(poolsHashes)
      } catch (e) {
        setShowError(true)
      }
    },
    [openConfirmationModal, setPools]
  )

  return (
    <React.Fragment>
      <ErrorDialog open={showError} onClose={onCloseErrorDialog} />

      <ConfirmationDialog
        title={tr(messages.confirmTitle)}
        message={tr(messages.confirmMessage)}
        confirmationButtonText={tr(messages.confirmButton)}
        open={isConfirmationModalOpen}
        onCancel={closeConfirmationModal}
        onConfirm={onConfirmImport}
      />

      <FileInputHandler id="import-staking-settings" onFileLoaded={setImportedPools}>
        <ActionButton label={tr(messages.import)} icon={<ImportIcon />} />
      </FileInputHandler>
    </React.Fragment>
  )
}

const ExportPools = ({selectedPools}) => {
  const {translate: tr} = useI18n()

  const downloadSelectedPools = useCallback(
    () => exportPoolsToJson(selectedPools.map((p) => ({name: p.name, hash: p.poolHash}))),
    [selectedPools]
  )

  return (
    <ActionButton
      label={tr(messages.export)}
      icon={<ExportIcon />}
      onClick={downloadSelectedPools}
    />
  )
}

const Share = () => {
  const {translate: tr} = useI18n()
  const {history} = useReactRouter()

  // Note: not using `window.location.href` as then the component would not properly
  // listen to changes in url query
  const currentUrl = process.browser ? window.location.origin + history.createHref(location) : ''

  return (
    <ActionButton
      label={tr(messages.share)}
      icon={
        // Note(ppershing): this is a temporary workaround
        // as tooltip somehow messes up line height
        <div style={{height: '1em'}}>
          <CopyToClipboard value={currentUrl}>
            <ShareIcon />
          </CopyToClipboard>
        </div>
      }
    />
  )
}

const ActionsBar = ({selectedPools}: Props) => (
  <Grid container direction="row" alignItems="center" justify="space-between" wrap="nowrap">
    <Grid item>
      <Share />
    </Grid>
    <Grid item>
      <ImportPools />
    </Grid>
    <Grid item>
      <ExportPools selectedPools={selectedPools} />
    </Grid>
  </Grid>
)

export default ActionsBar