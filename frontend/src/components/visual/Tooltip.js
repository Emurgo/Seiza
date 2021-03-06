import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {Tooltip as MuiTooltip} from '@material-ui/core'

import {mergeStylesheets} from '@/helpers/styles'

const useStyles = makeStyles(({palette, typography, spacing}) => ({
  tooltip: {
    backgroundColor: palette.background.tooltip,
    color: palette.text.primary,
    // TODO: once shadows branch is merged, use createShadow function
    boxShadow: `0px 10px 20px 0px ${fade(palette.primary.main, 0.08)}`,
    borderRadius: '30px',
    padding: spacing(1),
    paddingLeft: spacing(3),
    paddingRight: spacing(3),
  },
}))

const Tooltip = ({classes: customClasses, enterTouchDelay = 0, ...props}) => {
  const classes = useStyles()

  return (
    <MuiTooltip
      enterTouchDelay={enterTouchDelay}
      classes={mergeStylesheets(customClasses, classes)}
      {...props}
    />
  )
}

export default Tooltip
