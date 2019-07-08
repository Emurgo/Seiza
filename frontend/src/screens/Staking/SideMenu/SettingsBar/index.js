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
import PoolsToCompare from './PoolsToCompare'
import ActionsBar from './ActionsBar'

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
}))

const useDialogStyles = makeStyles((theme) => ({
  modalContainer: {
    marginTop: theme.spacing(3),
  },
  modalPaper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

const MobileSettingsBar = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {selectedPools} = useSelectedPoolsContext()
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
              <PoolsToCompare />
            </DialogContent>
            <DialogActions>
              <ActionsBar />
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </WithModalState>
  )
}

const DesktopSettingsBar = () => {
  const classes = useStyles()
  return (
    <Grid container className={classes.wrapper} direction="row">
      <PoolsToCompare />
      <ActionsBar />
    </Grid>
  )
}

const SettingsBar = () => {
  const isMobile = useIsMobile()
  const {htmlNode} = useMobileStakingSettingsRef()

  return isMobile ? (
    <Portal container={htmlNode}>
      <MobileSettingsBar />
    </Portal>
  ) : (
    <DesktopSettingsBar />
  )
}

export default SettingsBar
