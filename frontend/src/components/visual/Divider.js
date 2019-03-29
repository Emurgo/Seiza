import React from 'react'
import {Divider as MuiDivider} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {mergeStylesheets} from '@/helpers/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.contentUnfocus,
  },
  light: {
    color: theme.palette.unobtrusiveContentHighlight,
  },
}))

const Divider = ({classes: customClasses = {}, ...props}) => {
  const classes = useStyles()
  return <MuiDivider classes={mergeStylesheets(customClasses, classes)} {...props} />
}

export default Divider
