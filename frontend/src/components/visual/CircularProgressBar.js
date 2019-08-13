// @flow
import React from 'react'
import _ from 'lodash'
import {makeStyles, useTheme} from '@material-ui/styles'

import type {ComponentType} from 'react'

const colorNameFromValue = (value: number): string => {
  const COLORS = [
    {maxValue: 0.25, color: 'alertStrong'},
    {maxValue: 0.75, color: 'warning'},
    {maxValue: Infinity, color: 'emphasis'},
  ]
  return _.find(COLORS, ({maxValue}) => value <= maxValue).color
}

const getColors = (theme, value: number) => {
  const rangeName = colorNameFromValue(value)
  return {
    color: theme.palette[rangeName].color,
    backgroundColor: theme.palette[rangeName].background,
  }
}

const useStyles = makeStyles((theme) => ({
  background: {
    fill: 'none',
  },
  progress: {
    fill: 'none',
  },
  percentText: {
    fontSize: theme.typography.fontSize * 1.25,
    fontWeight: '500',
    stroke: theme.palette.contentFocus,
    fill: theme.palette.contentFocus,
    fontFamily: theme.typography.fontFamily,
  },
  text: {
    fontSize: theme.typography.fontSize * 0.625,
    fontWeight: '200',
    letterSpacing: 1.05,
    stroke: theme.palette.contentFocus,
    fontFamily: theme.typography.fontFamily,
  },
}))

export type ExternalProps = {|
  +value: number,
  +label: string,
  +height: number,
  +width: number,
  +alignText: 'middle' | 'left' | 'right',
|}

const Circle = ({size, value}) => {
  const classes = useStyles()
  const theme = useTheme()

  const progressColor = getColors(theme, value).color
  const backgroundColor = getColors(theme, value).backgroundColor

  const strokeWidth = 7.5

  // SVG centers the stroke width on the radius
  const radius = (size - strokeWidth) / 2

  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2

  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - dashArray * value
  const strokeWidthStr = `${strokeWidth}px`
  return (
    <React.Fragment>
      <circle
        className={classes.background}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidthStr}
        style={{
          stroke: backgroundColor,
        }}
      />
      {/* foreground arc */}
      <circle
        className={classes.progress}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidthStr}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          stroke: progressColor,
        }}
      />
    </React.Fragment>
  )
}

const CircularProgressBar: ComponentType<ExternalProps> = ({
  value,
  label,
  height,
  width,
  textAlign,
}) => {
  const classes = useStyles()

  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${width} ${height}`

  const percentText = `${Math.round(value * 100)}%`

  return (
    <svg width={width} height={height} viewBox={viewBox}>
      <Circle value={value} size={height} />
      <text className={classes.percentText} x="50%" y="50%" dy="0.1em" textAnchor={textAlign}>
        {percentText}
      </text>
      <text className={classes.text} x="50%" y="50%" dy="1.5em" textAnchor={textAlign}>
        {label}
      </text>
    </svg>
  )
}

export default CircularProgressBar
