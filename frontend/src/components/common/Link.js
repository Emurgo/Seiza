// @flow
import React from 'react'
import cn from 'classnames'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(({typography}) => ({
  monospace: typography._monospace,
  bold: {
    fontWeight: '500',
  },
}))

type Props = {
  to: string,
  target?: string,
  children: React$Node,
  onClick?: Function,
  monospace?: boolean,
  underline?: boolean,
  external?: boolean,
  bold?: boolean,
  className?: string,
}

const Link = ({
  to,
  children,
  target = '_self',
  underline,
  external,
  monospace = false,
  bold = false,
  className,
}: Props) => {
  const classes = useStyles()
  const linkProps = external ? {component: 'a', href: to} : {component: RouterLink, to}
  return to ? (
    <MuiLink
      {...linkProps}
      target={target}
      underline={underline}
      className={cn(monospace && classes.monospace, bold && classes.bold, className)}
    >
      {children}
    </MuiLink>
  ) : (
    children
  )
}

export default Link
