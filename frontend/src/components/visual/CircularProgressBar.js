// @flow
import React from 'react'
import {withStyles, createStyles} from '@material-ui/core'

import type {ComponentType} from 'react'

const styles = (theme) =>
  createStyles({
    background: {
      fill: 'none',
      stroke: '#ddd',
    },
    progress: {
      fill: 'none',
      stroke: 'red',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    percentText: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    text: {
      fontSize: '10px',
    },
  })

// Based on https://codepen.io/bbrady/pen/ozrjKE
const _CircularProgressBar = ({value, label, classes}) => {
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

type ExternalProps = {
  value: number,
  label: string,
}

export default (withStyles(styles)(_CircularProgressBar): ComponentType<ExternalProps>)
