import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {Tooltip as MuiTooltip} from '@material-ui/core'

import {mergeStylesheets} from '@/helpers/styles'

const useStyles = makeStyles(({palette, typography, spacing}) => ({
  tooltip: {
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    // TODO: once shadows branch is merged, use createShadow function
    boxShadow: `0px 10px 20px 0px ${fade(palette.primary.main, 0.08)}`,
    borderRadius: '30px',
    padding: spacing.unit,
    paddingLeft: spacing.unit * 3,
    paddingRight: spacing.unit * 3,
  },
}))

const Tooltip = ({classes: customClasses, ...props}) => {
  const classes = useStyles()

  return (
    <MuiTooltip
      enterTouchDelay={100}
      classes={mergeStylesheets(classes, customClasses)}
      {...props}
    />
  )
}

export default Tooltip
