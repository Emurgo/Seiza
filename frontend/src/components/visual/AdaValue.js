import React from 'react'
import {compose} from 'redux'

import {withStyles, createStyles, Typography} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'

const styles = (theme) =>
  createStyles({
    wrapper: {
      '& > *': {
        display: 'inline',
      },
    },
  })

// TODO: once needed, add variant prop
const AdaValue = ({value, i18n, classes, options, showCurrency, withSign = false}) => {
  if (value == null) {
    return options.defaultValue
  }
  const formatted = i18n.formatAdaSplit(value, {withSign: false})
  return (
    <span className={classes.wrapper}>
      <Typography variant="body1" component="span">
        {formatted.integral}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {formatted.fractional}
      </Typography>
      <Typography variant="body1" component="span">
        {showCurrency ? ' ADA' : ''}
      </Typography>
    </span>
  )
}

export default compose(
  withStyles(styles),
  withI18n
)(AdaValue)
