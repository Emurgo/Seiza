import React from 'react'
import classnames from 'classnames'
import {Paper, Typography, createStyles, withStyles} from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    alert: {
      padding: theme.spacing.unit * 2,
    },
    warning: {
      color: theme.palette.warning.color,
      backgroundColor: theme.palette.warning.background,
      fontWeight: 'bold',
    },
  })

const Alert = ({message, warning, classes}) => {
  return (
    <Paper className={classnames(classes.alert, {[classes.warning]: warning})}>
      <Typography variant="warning">{message}</Typography>
    </Paper>
  )
}

export default withStyles(styles)(Alert)
