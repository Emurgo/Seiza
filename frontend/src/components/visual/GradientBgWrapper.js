// @flow
import React, {ReactNode} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {gradientBackground} from '../sharedStyles'

const styles: Object = {
  bg: {
    ...gradientBackground,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}

type PropTypes = {
  children: ReactNode,
  classes: Object,
}

const GradientBgWrapper = ({children, classes}: PropTypes) => {
  return <div className={classes.bg}>{children}</div>
}

export default withStyles(styles)(GradientBgWrapper)
