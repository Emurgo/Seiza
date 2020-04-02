// @flow
import React from 'react'
import {defineMessages} from 'react-intl'

import {Alert} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {ERROR_TYPES} from '@/helpers/errors'

type Props = {
  error: any,
}

const text = defineMessages({
  title: 'Oopsie',
  NETWORK_ERROR: 'We have trouble communicating with the backend',
  NOT_FOUND__GENERIC: 'We could not found what are you looking for',
  NOT_FOUND__ADDRESS: 'Address does not exist',
  NOT_FOUND__TRANSACTION: 'Transaction does not exist',
  NOT_FOUND__BLOCK: 'Block does not exist',
  NOT_FOUND__SLOT: 'Slot does not exist',

  GENERIC: 'There was an error loading the data',
})

const formatErrorMessage = (error, tr) => {
  switch (error.type) {
    case ERROR_TYPES.NETWORK_ERROR:
      return tr(text.NETWORK_ERROR)
    case ERROR_TYPES.NOT_FOUND: {
      switch (error.entity) {
        case 'Address':
          return tr(text.NOT_FOUND__ADDRESS)
        case 'Transaction':
          return tr(text.NOT_FOUND__TRANSACTION)
        case 'Block':
          return tr(text.NOT_FOUND__BLOCK)
        case 'Slot':
          return tr(text.NOT_FOUND__SLOT)
        default:
          return tr(text.NOT_FOUND__GENERIC)
      }
    }
    default:
      return tr(text.GENERIC)
  }
}

// eslint-disable-next-line handle-callback-err
const LoadingError = ({error}: Props) => {
  const {translate: tr} = useI18n()
  const title = tr(text.title)
  const message = formatErrorMessage(error, tr)
  return <Alert type="alert" title={title} message={message} />
}

export default LoadingError
