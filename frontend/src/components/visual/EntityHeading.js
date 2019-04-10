// @flow
import React from 'react'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  underline: {
    borderBottom: `1px solid ${theme.palette.text.secondary}`,
  },
}))

type ExternalProps = {
  amount?: string,
  children: string,
  className?: string,
}

const EntityHeading = ({amount, children, className}: ExternalProps) => {
  const classes = useStyles()
  return (
    <Typography variant="h2" color="textSecondary" align="justify" className={className}>
      {amount ? (
        <React.Fragment>
          <span className={classes.underline}>{amount}</span> {children}
        </React.Fragment>
      ) : (
        children
      )}
    </Typography>
  )
}

export default EntityHeading
