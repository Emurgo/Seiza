// @flow
import React, {useState, useEffect, useRef} from 'react'
import {Fade} from '@material-ui/core'
import LoadingInProgress from './LoadingInProgress'
import Overlay from './Overlay'

type Props = {
  loading: boolean,
  showSpinner?: boolean,
  background?: string,
}

const FADE_TIMEOUT = {enter: 400, exit: 400}
const WAIT_BEFORE_SHOWING_TIMEOUT = 400

// Skip loading==true for short loading transitions
const useDelayedLoading = (loading, delay) => {
  const [delayedLoading, setDelayedLoading] = useState(false)
  const timeout = useRef(null)

  useEffect(() => {
    // transition true->false -- immediate
    if (!loading) {
      if (delayedLoading) {
        setDelayedLoading(false)
      }
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
    }

    // transition false->true -- delay
    if (loading && !delayedLoading && !timeout.current) {
      timeout.current = setTimeout(() => {
        setDelayedLoading(true)
        timeout.current = null
      }, delay)
    }
  })

  return delayedLoading
}

// Note: Parent has to have position:relative
const LoadingOverlay = ({loading, showSpinner = true, background}: Props) => {
  loading = useDelayedLoading(loading, WAIT_BEFORE_SHOWING_TIMEOUT)

  // active = overlays content
  const [active, setActive] = useState(false)
  // entering = fading in. If loading finishes quickly, we still want to show the full animation
  const [entering, setEntering] = useState(false)

  // enable if not
  useEffect(() => {
    if (loading && !active) {
      setActive(true)
      setEntering(true)
    }
  })

  const onEntered = () => setEntering(false)
  const onExited = () => setActive(false)

  const spinner = showSpinner ? <LoadingInProgress /> : null

  return (
    active && (
      <Fade
        /* keep entering even if loading switches to off */
        in={entering || loading}
        onEntered={onEntered}
        timeout={FADE_TIMEOUT}
        onExited={onExited}
      >
        <Overlay.Content background={background}>{spinner}</Overlay.Content>
      </Fade>
    )
  )
}

export default LoadingOverlay
