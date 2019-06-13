// @flow

import React from 'react'

import {useRequestAnimationFrame} from '@/hooks/useRequestAnimationFrame'

const _useScroll = (el) => {
  const [scrollStep, setScrollStep] = React.useState(0)

  const scroll = () => {
    if (el == null || scrollStep === 0) return

    // Note: no need to clamp, if value is "out of range", browser will just deal with it
    el.scrollLeft = el.scrollLeft + scrollStep
  }

  useRequestAnimationFrame(scroll, scrollStep !== 0)

  return {scrollStep, setScrollStep, scroll}
}

export const useArrowsScrolling = (el: any, speed: number) => {
  const {scrollStep, setScrollStep} = _useScroll(el)

  const onMouseUp = React.useCallback(() => setScrollStep(0), [setScrollStep])
  const onArrowLeft = React.useCallback(() => setScrollStep(-speed), [setScrollStep, speed])
  const onArrowRight = React.useCallback(() => setScrollStep(speed), [setScrollStep, speed])

  return {
    onArrowLeft,
    onArrowRight,
    onMouseUp,
    isHolding: scrollStep !== 0,
    isHoldingRight: scrollStep > 0,
    isHoldingLeft: scrollStep < 0,
  }
}

export const useKeyboardScrolling = (el: any, speed: number) => {
  const {setScrollStep} = _useScroll(el)

  const onKeyDown = React.useCallback(
    (e) => {
      const isLeftArrow = e.keyCode === 37
      const isRightArrow = e.keyCode === 39

      if (!isLeftArrow && !isRightArrow) return

      setScrollStep(speed * (isLeftArrow ? -1 : 1))
    },
    [setScrollStep, speed]
  )

  const onKeyUp = React.useCallback((e) => setScrollStep(0), [setScrollStep])

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}
