// @flow
import React from 'react'
import cn from 'classnames'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  underline: {
    borderBottom: `1px solid ${theme.palette.text.secondary}`,
  },
  title: {
    'color': theme.palette.sectionLabel,
    '&:after': {
      content: '""',
      background: theme.palette.text.secondary,
      position: 'absolute',
      bottom: -8,
      left: '25%',
      right: '25%',
      width: '50%',
      height: '1px',
    },
  },
  wrapper: {
    display: 'inline-block',
    position: 'relative',
  },
}))

type ExternalProps = {
  children: string,
  className?: string,
}

const EntityHeading = ({children, className}: ExternalProps) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Typography
        variant="h2"
        color="textSecondary"
        align="justify"
        className={cn(classes.title, className)}
      >
        {children}
      </Typography>
    </div>
  )
}

export default EntityHeading
