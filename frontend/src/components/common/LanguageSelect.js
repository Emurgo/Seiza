// @flow

import React from 'react'
import {compose} from 'redux'
import {withStyles} from '@material-ui/core'

import {withSetLocale} from '@/components/HOC/intl'
import {Select} from '@/components/visual'

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    width: '60px',
  },
})

// TODO: use images instead of names
export default compose(
  withStyles(styles),
  withSetLocale
)(({setLocale, locale, classes}) => (
  <Select
    className={classes.select}
    value={locale}
    onChange={(e) => setLocale(e.target.value)}
    options={[{value: 'en', label: 'En'}, {value: 'es', label: 'Es'}]}
  />
))
