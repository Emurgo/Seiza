// @flow
import React from 'react'
import classNames from 'classnames'
import MaterialButton from '@material-ui/core/Button'
import {withStyles, createStyles} from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    primary: {
      background: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
      color: 'white',
    },
  })

const Button = ({primary, classes, className, ...props}) => (
  <MaterialButton
    className={classNames({[className]: className, [classes.primary]: primary})}
    {...props}
  />
)

export default withStyles(styles)(Button)
