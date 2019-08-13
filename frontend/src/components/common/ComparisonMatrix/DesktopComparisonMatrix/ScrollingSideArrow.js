// @flow

import React, {useEffect, useState, useCallback} from 'react'
import _ from 'lodash'
import idx from 'idx'
import {makeStyles, useTheme} from '@material-ui/styles'
import {ChevronLeft, ChevronRight} from '@material-ui/icons'

import {lighten} from '@material-ui/core/styles/colorManipulator'

const useStyles = makeStyles((theme) => ({
  arrow: ({direction}) => ({
    position: 'absolute',
    display: 'flex',
    padding: theme.spacing(1.5),
    borderRadius: 30,
    transition: theme.hover.transitionIn(['top'], 500),
    ...(direction === 'left' ? {left: 30} : {right: 30}),
  }),
  arrowWrapper: {
    // In context of CM this actually behaves as 100%, because 100% does not work
    height: 'inherit',
    minWidth: 100,
    cursor: 'pointer',
    position: 'relative',
  },
}))

type Props = {|
  scrollAreaRef: any,
  direction: 'left' | 'right',
  onUp: Function,
  onDown: Function,
  background: string,
  active: boolean,
  fullScreenScrollRef: any,
|}

const ARROWS = {
  left: ChevronLeft,
  right: ChevronRight,
}

const useArrowHover = () => {
  const [isHoveringOverArrow, setIsHoveringOverArrow] = useState(false)

  const activateHoverOverArrow = useCallback(() => setIsHoveringOverArrow(true), [
    setIsHoveringOverArrow,
  ])
  const removeHoverOverArrow = useCallback(() => setIsHoveringOverArrow(false), [
    setIsHoveringOverArrow,
  ])

  return {isHoveringOverArrow, activateHoverOverArrow, removeHoverOverArrow}
}

const ScrollingSideArrow = ({
  scrollAreaRef, // The area within which arrows perform scrolling
  direction,
  onUp,
  onDown,
  background,
  active,
  fullScreenScrollRef, // where `onscroll` listens
}: Props) => {
  const [topOffset, setTopOffset] = useState(0)
  const {isHoveringOverArrow, activateHoverOverArrow, removeHoverOverArrow} = useArrowHover()
  const classes = useStyles({direction})
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  const onWindowScroll = useCallback(
    _.debounce((e) => {
      const el = scrollAreaRef.current
      if (!el) return

      const {y, height: scrollAreaHeight} = el.getBoundingClientRect()

      const screenHeight = Math.max(
        idx(document, (_) => _.documentElement.clientHeight) || 0,
        window.innerHeight || 0
      )

      const newOffset =
        y <= 0
          ? Math.min(Math.abs(y) + screenHeight / 2, scrollAreaHeight - 100)
          : Math.min(scrollAreaHeight / 2, (screenHeight - y) / 2)

      setTopOffset(newOffset)
    }, 100),
    [scrollAreaRef, setTopOffset]
  )

  useEffect(() => {
    // FIXME: I wanted to put that `el || window` logic outside of this component, but
    // then it just does not work. For some reason I am always getting ref.current = null
    const el = idx(fullScreenScrollRef, (_) => _.current) || window
    onWindowScroll()
    el.addEventListener('scroll', onWindowScroll)
    return () => {
      el.removeEventListener('scroll', onWindowScroll)
    }
  }, [fullScreenScrollRef, onWindowScroll])

  const Arrow = ARROWS[direction]
  const arrowBackground = active
    ? lighten(primaryColor, 0.8)
    : isHoveringOverArrow
      ? lighten(primaryColor, 0.85)
      : background
  const arrowShadow = `0px 0px 2px ${lighten(primaryColor, 0.8)}`

  return (
    <div
      className={classes.arrowWrapper}
      onMouseOver={activateHoverOverArrow}
      onMouseOut={removeHoverOverArrow}
      onMouseDown={onDown}
      onMouseUp={onUp}
    >
      <div
        className={classes.arrow}
        style={{
          top: topOffset,
          background: arrowBackground,
          boxShadow: isHoveringOverArrow ? arrowShadow : 'none',
        }}
      >
        <Arrow color="primary" />
      </div>
    </div>
  )
}

export default ScrollingSideArrow
