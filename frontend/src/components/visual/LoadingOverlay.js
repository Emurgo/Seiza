// @flow
import React from 'react'
import {Fade} from '@material-ui/core'
import LoadingInProgress from './LoadingInProgress'
import Overlay from './Overlay'

type Props = {
  loading: boolean,
}

const FADE_TIMEOUT = {enter: 1500, exit: 0}

// Note: Parent has to have position:relative
const LoadingOverlay = ({loading}: Props) => {
  return loading ? (
    <Fade in timeout={FADE_TIMEOUT}>
      <Overlay.Content>
        <LoadingInProgress />
      </Overlay.Content>
    </Fade>
  ) : null
}

export default LoadingOverlay
