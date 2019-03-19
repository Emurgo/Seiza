// @flow
import React from 'react'
import _ from 'lodash'
import type {ComponentType} from 'react'
import {makeStyles} from '@material-ui/styles'

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
    stroke: (props) => getColors(theme, props.value).backgroundColor,
  },
  progress: {
    fill: 'none',
    stroke: (props) => getColors(theme, props.value).color,
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

type ExternalProps = {
  +value: number,
  +label: string,
}

// Based on https://codepen.io/bbrady/pen/ozrjKE
const CircularProgressBar: ComponentType<ExternalProps> = ({value, label}) => {
  const classes = useStyles({value})
  const size = 75
  const strokeWidth = 8

  // SVG centers the stroke width on the radius
  const radius = (size - strokeWidth) / 2

  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${size} ${size}`

  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2

  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - dashArray * value
  const percentText = `${Math.round(value * 100)}%`
  const strokeWidthStr = `${strokeWidth}px`
  return (
    <svg width={size} height={size} viewBox={viewBox}>
      {/* background circle */}
      <circle
        className={classes.background}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidthStr}
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
        }}
      />
      <text className={classes.percentText} x="50%" y="50%" dy="0.1em" textAnchor="middle">
        {percentText}
      </text>
      <text className={classes.text} x="50%" y="50%" dy="1.5em" textAnchor="middle">
        {label}
      </text>
    </svg>
  )
}

export default CircularProgressBar
