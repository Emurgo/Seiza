// @flow

import React from 'react'
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Portal,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {CloseIconButton, Divider, MobileOnly, DesktopOnly} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {useMobileStakingSettingsRef} from '@/components/context/refs'

import {useSelectedPoolsContext} from '../../context/selectedPools'
import {LoadingError} from '@/components/common'

import ResetButton from './ResetButton'
import PoolsToCompare, {PoolsToCompareCount} from './PoolsToCompare'
import ActionsBar from './ActionsBar'
import AutoSaveBar from './AutoSaveBar'
import {useLoadSelectedPoolsData} from './dataLoaders'

const useMobileSettingsButtonStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    cursor: 'pointer',
  },
  bottomCard: {
    position: 'absolute',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 5,
    color: 'transparent',
    padding: theme.spacing(0.7),
    left: 2,
    top: 2,
  },
  upperCard: {
    position: 'absolute',
    background: theme.palette.primary.main,
    color: theme.palette.background.paper,
    borderRadius: 5,
    padding: theme.spacing(0.7),
  },
}))

const MobileSettingsButton = ({onClick, value}) => {
  const classes = useMobileSettingsButtonStyles()
  return (
    <div className={classes.wrapper} onClick={onClick}>
      <div className={classes.bottomCard}>
        <Typography variant="h4">{value}</Typography>
      </div>
      <div className={classes.upperCard}>
        {/* Note: 'value' is supplied to have same width as bottomCard */}
        <Typography variant="h4">{value}</Typography>
      </div>
    </div>
  )
}

// TODO: use spacing(...) from theme
const getSidePaddings = (theme) => ({paddingRight: 40, paddingLeft: 60})
const getTopBottomPaddings = (theme) => ({paddingTop: 20, paddingBottom: 20})
const useStyles = makeStyles((theme) => ({
  wrapper: {
    ...getTopBottomPaddings(theme),
    ...getSidePaddings(theme),

    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
  },
  autoSaveBar: {
    ...getSidePaddings(theme),
    ...getTopBottomPaddings(theme),
  },
  resetButton: {
    ...getSidePaddings(theme),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    textTransform: 'uppercase',
  },
  modalContent: {
    borderTop: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  modalTitle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  error: {
    ...getSidePaddings(theme),
    ...getTopBottomPaddings(theme),
  },
}))

const useDialogStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
    alignItems: 'flex-start',
  },
  paper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

const Error = ({error}) => {
  const classes = useStyles()
  return (
    <div className={classes.error}>
      <LoadingError error={error} />
    </div>
  )
}

type Props = {|
  selectedPools: Array<{name: string, poolHash: string}>,
  error: any,
|}

const MobileSettingsBar = ({selectedPools, error}: Props) => {
  const classes = useStyles()
  const modalClasses = useDialogStyles()

  return (
    <WithModalState>
      {({closeModal, isOpen, toggle}) => (
        <React.Fragment>
          <MobileSettingsButton onClick={toggle} value={selectedPools.length} />
          <Dialog classes={modalClasses} open={isOpen} onClose={closeModal}>
            <DialogTitle className={classes.modalTitle}>
              <Grid container justify="flex-end" alignItems="center">
                <CloseIconButton onClick={closeModal} />
              </Grid>
            </DialogTitle>
            <DialogContent className={classes.modalContent}>
              <ResetButton />
              <PoolsToCompare selectedPools={selectedPools} />
            </DialogContent>
            <DialogActions>
              <ActionsBar selectedPools={selectedPools} />
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </WithModalState>
  )
}

const DesktopSettingsBar = ({selectedPools, error}: Props) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <AutoSaveBar className={classes.autoSaveBar} />
      <Divider />
      <ResetButton className={classes.resetButton} />
      <Divider />
      <Grid container className={classes.wrapper} direction="row">
        {error && <Error error={error} />}
        <PoolsToCompareCount selectedPools={selectedPools} />
        <PoolsToCompare selectedPools={selectedPools} />
        <ActionsBar selectedPools={selectedPools} />
      </Grid>
    </React.Fragment>
  )
}

const SettingsBar = () => {
  const {htmlNode} = useMobileStakingSettingsRef()

  const {selectedPools: selectedPoolsHashes} = useSelectedPoolsContext()
  const {data: selectedPools, error} = useLoadSelectedPoolsData(selectedPoolsHashes)

  return (
    <React.Fragment>
      <MobileOnly>
        <Portal container={htmlNode}>
          <MobileSettingsBar {...{selectedPools, error}} />
        </Portal>
      </MobileOnly>
      <DesktopOnly>
        <DesktopSettingsBar {...{selectedPools, error}} />
      </DesktopOnly>
    </React.Fragment>
  )
}

export default SettingsBar
