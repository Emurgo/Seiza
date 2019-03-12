import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
  'dot': {
    'animation': '$loading-dots 1.5s infinite ease-in-out',
    '&:nth-of-type(1)': {
      animationDelay: '0.00s',
    },
    '&:nth-of-type(2)': {
      animationDelay: '0.25s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.5s',
    },
  },
  '@keyframes loading-dots': {
    '0%': {
      opacity: 0.4,
    },
    '50%': {
      opacity: 1.0,
    },
    '100%': {
      opacity: 0.4,
    },
  },
})

const LoadingDots = () => {
  const classes = useStyles()
  const dot = '•'
  return (
    <span>
      <span className={classes.dot}>{dot}</span>
      <span className={classes.dot}>{dot}</span>
      <span className={classes.dot}>{dot}</span>
    </span>
  )
}

export default LoadingDots
