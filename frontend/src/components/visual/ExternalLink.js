import React from 'react'
import {Link as MuiLink} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  standardLink: {
    fontWeight: 500,
  },
}))

const ExternalLink = ({to, children}) => {
  const classes = useStyles()
  return (
    <MuiLink className={classes.standardLink} href={to}>
      {children}
    </MuiLink>
  )
}

export default ExternalLink
