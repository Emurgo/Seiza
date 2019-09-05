// @flow
import React from 'react'
import cn from 'classnames'
import {Link as MuiLink} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  standardLink: {
    fontWeight: 500,
  },
  monospace: theme.typography._monospace,
}))

type Props = {
  to: string,
  target?: string,
  children: React$Node,
  onClick?: Function,
  monospace?: boolean,
}

const ExternalLink = ({to, target, children, onClick, monospace}: Props) => {
  const classes = useStyles()
  return (
    <MuiLink
      className={cn(classes.standardLink, monospace && classes.monospace)}
      href={to}
      target={target}
      onClick={onClick}
    >
      {children}
    </MuiLink>
  )
}

export default ExternalLink
