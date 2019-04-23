// @flow
import React from 'react'
import {Link as MuiLink} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  standardLink: {
    fontWeight: 500,
  },
}))

type Props = {
  to: string,
  target?: string,
  children: React$Node,
}

const ExternalLink = ({to, target, children}: Props) => {
  const classes = useStyles()
  return (
    <MuiLink className={classes.standardLink} href={to} target={target}>
      {children}
    </MuiLink>
  )
}

export default ExternalLink
