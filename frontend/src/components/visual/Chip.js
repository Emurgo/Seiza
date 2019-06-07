// @flow

import React from 'react'
import {Chip as MuiChip} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {mergeStylesheets} from '@/helpers/styles'

const useStyles = makeStyles((theme) => ({
  root: ({rounded}) => ({
    ...(rounded ? {height: 24, borderRadius: 5} : {}),
  }),
}))

type Props = {
  rounded?: boolean,
  classes?: {},
}

const Chip = ({children, rounded, classes: customClasses = {}, ...props}: Props) => {
  const classes = useStyles({rounded})

  return <MuiChip classes={mergeStylesheets(customClasses, classes)} {...props} />
}

export default Chip
