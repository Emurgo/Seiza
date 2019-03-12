import React from 'react'
import {Divider as MuiDivider} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.contentUnfocus,
  },
  light: {
    color: theme.palette.unobtrusiveContentHighlight,
  },
}))

const Divider = ({classes, ...props}) => {
  return <MuiDivider classes={{...useStyles(), ...classes}} {...props} />
}

export default Divider
