// @flow
import React from 'react'
import classNames from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {withStyles, createStyles} from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    gradient: {
      background: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
      color: theme.palette.primary.contrastText,
    },
    rounded: {
      borderRadius: '30px',
    },
  })

const Button = ({gradient, rounded, classes, className, ...props}) => (
  <MaterialButton
    className={classNames({
      [classes.gradient]: gradient,
      [classes.rounded]: rounded,
      [className]: className,
    })}
    {...props}
  />
)

export default withStyles(styles)(Button)
