// @flow

import React from 'react'
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
|}

export const ScrollOverlayWrapper = ({
  children,
  upBackground,
  downBackground,
  borderRadius,
}: ScrollOverlayWrapperProps) => {
  const classes = useScrollOverlayStyles()
  return (
    <div className={classes.wrapper}>
      <ScrollOverlay direction="left" {...{upBackground, downBackground, borderRadius}} />
      <ScrollOverlay direction="right" {...{upBackground, downBackground, borderRadius}} />
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
    ...(direction === 'left' ? {left: 0} : {right: 0}),
  }),
  up: {
    height: 60,
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
