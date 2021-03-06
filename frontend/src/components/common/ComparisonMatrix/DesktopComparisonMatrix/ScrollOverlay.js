// @flow

import React from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'

const useScrollOverlayStyles = makeStyles((theme) => ({
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
}))

type ScrollOverlayWrapperProps = {|
  children: React$Node,
  upBackground: string,
  downBackground: string,
  borderRadius: number,
  className?: string,
  headerHeight?: number,
|}

export const ScrollOverlayWrapper = ({
  children,
  upBackground,
  downBackground,
  borderRadius,
  className,
  headerHeight,
}: ScrollOverlayWrapperProps) => {
  const classes = useScrollOverlayStyles()
  return (
    <div className={cn(classes.wrapper, className)}>
      <ScrollOverlay
        direction="left"
        {...{upBackground, downBackground, borderRadius, headerHeight}}
      />
      <ScrollOverlay
        direction="right"
        {...{upBackground, downBackground, borderRadius, headerHeight}}
      />
      {children}
    </div>
  )
}

const REVERSED_DIRECTIONS = {
  left: 'right',
  right: 'left',
}

const useStyles = makeStyles((theme) => ({
  wrapper: ({direction}) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
    width: 25,
    zIndex: 1,
    // So that we avoid cases like eg. inactive filters when there
    // is minor overlay (filter is still visible)
    pointerEvents: 'none',
    ...(direction === 'left' ? {left: 0} : {right: 0}),
  }),
  up: {
    height: ({headerHeight}) => (headerHeight != null ? headerHeight : 60),
    borderRadius: ({borderRadius}) => borderRadius,
    background: ({direction, upBackground, downBackground}) =>
      `linear-gradient(to ${REVERSED_DIRECTIONS[direction]},
        ${upBackground} 0%,
        ${fade(darken(downBackground, 0.04), 0)} 100%)`,
  },
  down: {
    flex: 1,
    background: ({direction, upBackground, downBackground}) =>
      `linear-gradient(to ${REVERSED_DIRECTIONS[direction]},
        ${downBackground} 0%,
        ${fade(downBackground, 0)} 100%)`,
  },
}))

type ScrollOverlayProps = {|
  direction: 'left' | 'right',
  upBackground: string,
  downBackground: string,
  borderRadius: number,
  headerHeight?: number,
|}

const ScrollOverlay = (props: ScrollOverlayProps) => {
  const classes = useStyles(props)
  return (
    <div className={classes.wrapper}>
      <div className={classes.up} />
      <div className={classes.down} />
    </div>
  )
}
