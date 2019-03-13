// @flow
import React from 'react'

import DebugApolloError from './DebugApolloError'
import LoadingError from './LoadingDots'
import Overlay from './Overlay'

type Props = {
  error: any,
}

// Note: Parent has to have position:relative
const LoadingErrorOverlay = ({error}: Props) => {
  return error ? (
    <Overlay.Content>
      <DebugApolloError error={error} />
      <LoadingError error={error} />
    </Overlay.Content>
  ) : null
}

export default LoadingErrorOverlay
