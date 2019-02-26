import React from 'react'
import {compose} from 'redux'

import {withStyles, createStyles} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'

const styles = (theme) =>
  createStyles({
    integral: {},
    fractional: {
      color: 'gray',
      fontSize: '0.85em',
    },
  })

// TODO: once needed, add variant prop
const AdaValue = ({value, i18n, classes, options}) => {
  if (value == null) {
    return options.defaultValue
  }
  const formatted = i18n.formatAdaSplit(value)
  return (
    <React.Fragment>
      <span className={classes.integral}>{formatted.integral}</span>
      <span className={classes.fractional}>{formatted.fractional}</span>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles),
  withI18n
)(AdaValue)
