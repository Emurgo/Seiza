// @flow
import React from 'react'
import cn from 'classnames'
import {ReactComponent as Close} from '@/assets/icons/close.svg'
import {makeStyles} from '@material-ui/styles'
import {IconButton} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  iconButton: {
    'color': theme.palette.contentUnfocus,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

type ExternalProps = {
  onClick: Function,
  className?: string,
}

const CloseIconButton = ({onClick, className, ...props}: ExternalProps) => {
  const classes = useStyles()
  return (
    <IconButton
      color="primary"
      className={cn(classes.iconButton, className)}
      onClick={onClick}
      {...props}
    >
      <Close />
    </IconButton>
  )
}

export default CloseIconButton
