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
import {defineMessages} from 'react-intl'

import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {CloseIconButton} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {useMobileStakingSettingsRef} from '@/components/context/refs'
import {useI18n} from '@/i18n/helpers'

import {useSelectedPoolsContext} from '../../context/selectedPools'
import {LoadingError} from '@/components/common'

import PoolsToCompare from './PoolsToCompare'
import ActionsBar from './ActionsBar'
import {useLoadSelectedPoolsData} from './dataLoaders'

const messages = defineMessages({
  modalTitle: 'Settings',
})

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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: '20px 40px 20px 60px',
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
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
    padding: '20px 40px 20px 60px',
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
  const {translate: tr} = useI18n()
  const modalClasses = useDialogStyles()

  return (
    <WithModalState>
      {({closeModal, isOpen, toggle}) => (
        <React.Fragment>
          <MobileSettingsButton onClick={toggle} value={selectedPools.length} />
          <Dialog classes={modalClasses} open={isOpen} onClose={closeModal}>
            <DialogTitle className={classes.modalTitle}>
              <Grid container justify="space-between" alignItems="center">
                <Typography variant="h4" color="textSecondary" className={classes.title}>
                  {tr(messages.modalTitle)}
                </Typography>
                <CloseIconButton onClick={closeModal} />
              </Grid>
            </DialogTitle>
            <DialogContent className={classes.modalContent}>
              {error && <Error error={error} />}
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
    <Grid container className={classes.wrapper} direction="row">
      {error && <Error error={error} />}
      <PoolsToCompare selectedPools={selectedPools} />
      <ActionsBar selectedPools={selectedPools} />
    </Grid>
  )
}

const SettingsBar = () => {
  const isMobile = useIsMobile()
  const {htmlNode} = useMobileStakingSettingsRef()

  const {selectedPools: selectedPoolsHashes} = useSelectedPoolsContext()
  const {data: selectedPools, error} = useLoadSelectedPoolsData(selectedPoolsHashes)

  return isMobile ? (
    <Portal container={htmlNode}>
      <MobileSettingsBar {...{selectedPools, error}} />
    </Portal>
  ) : (
    <DesktopSettingsBar {...{selectedPools, error}} />
  )
}

export default SettingsBar
