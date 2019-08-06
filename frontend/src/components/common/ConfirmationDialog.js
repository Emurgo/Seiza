// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'
import {Button} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  defaultCancel: 'Cancel',
  defaultOk: 'Ok',
})

type Props = {|
  +open: boolean,
  +title: React$Node,
  +message: string,
  +onCancel?: Function,
  +onConfirm?: Function,
  +confirmationButtonText?: React$Node,
  +cancelButtonText?: React$Node,
|}

const ConfirmationDialog = ({
  open,
  message,
  onCancel,
  onConfirm,
  title,
  confirmationButtonText,
  cancelButtonText,
}: Props) => {
  const {translate: tr} = useI18n()
  return (
    <Dialog maxWidth="xs" open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelButtonText || tr(messages.defaultCancel)}</Button>
        <Button onClick={onConfirm}>{confirmationButtonText || tr(messages.defaultOk)}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
