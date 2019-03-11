// @flow
import React from 'react'
import {defineMessages} from 'react-intl'

import DebugApolloError from './DebugApolloError'
import Overlay from './Overlay'
import Alert from './Alert'
import {useI18n} from '@/i18n/helpers'

type Props = {
  error: any,
}

const text = defineMessages({
  title: 'Ooopsie',
  message: 'There was an error loading the data',
})

// Note: Parent has to have position:relative
const LoadingErrorOverlay = ({error}: Props) => {
  const {translate: tr} = useI18n()

  return error ? (
    <Overlay.Content>
      <DebugApolloError error={error} />
      <Alert type="warning" title={tr(text.title)} message={tr(text.message)} />
    </Overlay.Content>
  ) : null
}

export default LoadingErrorOverlay
