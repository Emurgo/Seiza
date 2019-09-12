// @flow
import React, {useCallback} from 'react'
import NoSSR from 'react-no-ssr'
import _ from 'lodash'
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
import config from '@/config'
import {useMobileStakingSettingsRef} from '@/components/context/refs'

import {useSelectedPoolsContext} from '../../context/selectedPools'
import {LoadingError} from '@/components/common'

import ResetButton from './ResetButton'
import DelegateButton from './DelegateButton'
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
const getMobilePaddings = (theme) => `${theme.spacing(1)}px ${theme.spacing(2)}px`
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
    height: 80,
  },
  mobileAutoSaveBar: {
    padding: getMobilePaddings(theme),
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  resetButton: {
    ...getSidePaddings(theme),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  mobileResetButton: {
    padding: getMobilePaddings(theme),
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  mobilePools: {
    padding: getMobilePaddings(theme),
  },
  title: {
    textTransform: 'uppercase',
  },
  modalContent: {
    padding: 0,
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
  stakingSettingsPortal: {
    // width and height need to be defined, why??
    height: 40,
    width: 28,
    marginRight: 20,
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
              {!config.isYoroi && <AutoSaveBar className={classes.mobileAutoSaveBar} />}
              <ResetButton className={classes.mobileResetButton} />
              <div className={classes.mobilePools}>
                <PoolsToCompare selectedPools={selectedPools} />
              </div>
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

const relevantDataForYoroi = (selectedPools) => {
  return _.map(selectedPools, _.partialRight(_.pick, ['name', 'poolHash']))
}

const YoroiDelegate = ({selectedPools}) => {
  const delegate = useCallback(() => {
    window.parent.postMessage(
      relevantDataForYoroi(selectedPools),
      `chrome-extension://${config.yoroiExtensionHash}/main_window.html#/staking`
    )
  }, [selectedPools])

  return <DelegateButton onClick={delegate} disabled={selectedPools.length === 0} />
}

const DesktopSettingsBar = ({selectedPools, error}: Props) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      {config.isYoroi ? (
        <Grid container>
          <YoroiDelegate selectedPools={selectedPools} />
        </Grid>
      ) : (
        <AutoSaveBar className={classes.autoSaveBar} />
      )}

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
  const classes = useStyles()
  const {htmlNode} = useMobileStakingSettingsRef()

  const {selectedPools: selectedPoolsHashes} = useSelectedPoolsContext()
  const {data: selectedPools, error} = useLoadSelectedPoolsData(selectedPoolsHashes)

  return (
    <React.Fragment>
      <MobileOnly>
        {config.isYoroi ? (
          // NoSSR is needed, otherwise content is broken (WHY???)
          <NoSSR>
            <Grid container alignItems="center">
              <YoroiDelegate selectedPools={selectedPools} />
              <div className={classes.stakingSettingsPortal}>
                <MobileSettingsBar {...{selectedPools, error}} />
              </div>
            </Grid>
          </NoSSR>
        ) : (
          <Portal container={htmlNode}>
            <MobileSettingsBar {...{selectedPools, error}} />
          </Portal>
        )}
      </MobileOnly>
      <DesktopOnly>
        <DesktopSettingsBar {...{selectedPools, error}} />
      </DesktopOnly>
    </React.Fragment>
  )
}

export default SettingsBar
