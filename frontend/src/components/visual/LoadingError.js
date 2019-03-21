// @flow
import React from 'react'
import {defineMessages} from 'react-intl'

import Alert from './Alert'
import {useI18n} from '@/i18n/helpers'

type Props = {
  error: any,
}

const text = defineMessages({
  title: 'Ooopsie',
  message: 'There was an error loading the data',
})

// eslint-disable-next-line handle-callback-err
const LoadingError = ({error}: Props) => {
  const {translate: tr} = useI18n()
  return <Alert type="alert" title={tr(text.title)} message={tr(text.message)} />
}

export default LoadingError
