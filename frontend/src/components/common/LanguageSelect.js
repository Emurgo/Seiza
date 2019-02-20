// @flow

import React from 'react'
import {compose} from 'redux'
import {Select, OutlinedInput, withStyles} from '@material-ui/core'

import {withSetLocale} from '../HOC/intl'

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    height: '40px',
  },
})

// TODO: use images instead of names
export default compose(
  withStyles(styles),
  withSetLocale
)(({setLocale, locale, classes}) => (
  <Select
    native
    className={classes.select}
    value={locale}
    onChange={(e) => setLocale(e.target.value)}
    input={<OutlinedInput />}
  >
    <option value={'en'}>En</option>
    <option value={'es'}>Es</option>
  </Select>
))
