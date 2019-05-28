// @flow
import React from 'react'
import QRCode from 'qrcode.react'
import {Grid, Dialog, DialogContent, DialogContentText, withMobileDialog} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {CloseIconButton} from '@/components/visual'

type QRDialogProps = {
  +isOpen: boolean,
  +onClose: () => any,
  +qrCodeValue: string,
  +fullScreen: boolean,
  +description: React$Node,
}

const QR_CODE_SIZE = 256
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing.unit * 3,
  },
  entity: {
    maxWidth: QR_CODE_SIZE + theme.spacing.unit * 3,
  },
  closeWrapper: {
    height: 24, // Must be same as spacing in Grid in DialogContent
    textAlign: 'right',
  },
}))

const paperProps = {elevation: 0}
const QRDialog = withMobileDialog()(
  ({isOpen, onClose, description, qrCodeValue, fullScreen}: QRDialogProps) => {
    const classes = useStyles()

    return (
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={onClose}
        PaperProps={paperProps}
        aria-labelledby="Address QR code"
      >
        <div className={classes.closeWrapper}>
          <CloseIconButton aria-label="Hide-subscribe-footer" onClick={onClose} />
        </div>
        <DialogContent>
          <Grid
            container
            justify="center"
            direction="column"
            spacing={24}
            className={classes.dialogContent}
          >
            <Grid item>
              <QRCode value={qrCodeValue} size={QR_CODE_SIZE} />
            </Grid>
            <Grid item className={classes.entity}>
              <DialogContentText>{description}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    )
  }
)

export default QRDialog
