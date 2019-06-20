// @flow

import React, {useEffect, useState, useCallback} from 'react'
import _ from 'lodash'
import idx from 'idx'
import {makeStyles} from '@material-ui/styles'
import {ChevronLeft, ChevronRight} from '@material-ui/icons'

import {darken} from '@material-ui/core/styles/colorManipulator'

const useStyles = makeStyles((theme) => ({
  arrow: ({direction, background, active}) => ({
    background: active ? darken(background, 0.1) : background,
    position: 'absolute',
    display: 'flex',
    padding: theme.spacing(1.5),
    borderRadius: 30,
    transition: theme.hover.transitionIn(['top'], 500),
    ...(direction === 'left' ? {left: 30} : {right: 30}),
  }),
  arrowWrapper: ({direction}) => ({
    // In context of CM this actually behaves as 100%, because 100% does not work
    height: 'inherit',
    minWidth: 100,
    cursor: 'pointer',
    position: 'relative',
  }),
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
  const classes = useStyles({top: topOffset, direction, background, active})

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

  return (
    <div className={classes.arrowWrapper} onMouseDown={onDown} onMouseUp={onUp}>
      <div className={classes.arrow} style={{top: topOffset}}>
        <Arrow color="primary" />
      </div>
    </div>
  )
}

export default ScrollingSideArrow
