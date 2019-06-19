// @flow
import React from 'react'
import cn from 'classnames'
import {ReactComponent as Close} from '@/assets/icons/close.svg'
import {makeStyles} from '@material-ui/styles'
import {IconButton} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  iconButton: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  colorDefault: {
    color: theme.palette.contentUnfocus,
  },
  colorPrimary: {
    color: theme.palette.primary.main,
  },
}))

type ExternalProps = {
  onClick: Function,
  className?: string | false | null,
  color?: 'default' | 'primary',
}

const CloseIconButton = ({onClick, color = 'default', className, ...props}: ExternalProps) => {
  const classes = useStyles()
  const colorClass = {default: classes.colorDefault, primary: classes.colorPrimary}[color]

  return (
    <IconButton
      color="primary"
      className={cn(classes.iconButton, colorClass, className)}
      onClick={onClick}
      {...props}
    >
      <Close />
    </IconButton>
  )
}

export default CloseIconButton
