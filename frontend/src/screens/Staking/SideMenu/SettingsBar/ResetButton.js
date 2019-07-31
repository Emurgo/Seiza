import React, {useCallback} from 'react'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {IconButton, Typography, Grid} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {ConfirmationDialog} from '@/components/common'
import useModalState from '@/components/hooks/useModalState'
import useBooleanState from '@/components/hooks/useBooleanState'
import {useResetUrlAndStorage} from '../../context'
import {ReactComponent as ResetIcon} from '@/static/assets/icons/staking-simulator/reset-settings.svg'

const messages = defineMessages({
  reset: 'Reset all settings',
  resetConfirmTitle: 'Are you sure you want to reset all settings?',
  resetConfirmMessage:
    'Removes selected pools and resets all filters to defaults within staking simulator.',
  resetActionButton: 'Reset',
})

const useStyles = makeStyles((theme) => ({
  'wrapper': {
    height: '100%',
    overflow: 'visible', // Note: sticky navigation is not working without this
  },
  'panel': {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  'iconButton': {
    width: '100%',
    borderRadius: 0,
    background: theme.palette.background.paper,
    padding: 0,
  },
  '@global': {
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  },
  'spin': {
    animationName: 'spin',
    animationDuration: '500ms',
    animationTimingFunction: 'linear',
  },
}))

const ResetButton = ({className}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const resetUrlAndStorage = useResetUrlAndStorage()
  const {isOpen, openModal, closeModal} = useModalState()
  const [spin, setSpinOn, setSpinOff] = useBooleanState()
  const onReset = useCallback(() => {
    resetUrlAndStorage()
    closeModal()
    setSpinOn()
  }, [closeModal, resetUrlAndStorage, setSpinOn])
  return (
    <React.Fragment>
      <IconButton
        onClick={openModal}
        aria-label="Reset settings"
        className={classes.iconButton}
        color="primary"
      >
        <Grid container className={cn(classes.panel, className)} alignItems="center">
          <Grid container alignItems="center" direction="row">
            <div className={spin ? classes.spin : null} onAnimationEnd={setSpinOff}>
              <ResetIcon />
            </div>
            &nbsp;&nbsp;
            <Typography color="textSecondary" variant="overline">
              {tr(messages.reset)}
            </Typography>
          </Grid>
        </Grid>
      </IconButton>

      <ConfirmationDialog
        title={tr(messages.resetConfirmTitle)}
        message={tr(messages.resetConfirmMessage)}
        confirmationButtonText={tr(messages.resetActionButton)}
        open={isOpen}
        onCancel={closeModal}
        onConfirm={onReset}
      />
    </React.Fragment>
  )
}

export default ResetButton
