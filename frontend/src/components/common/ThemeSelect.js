// @flow

import React from 'react'
import {compose} from 'redux'
import {Select, OutlinedInput, withStyles} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'
import {withTheme, themeMessages} from '../HOC/theme'

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    height: '40px',
  },
})

// TODO: Add label

export default compose(
  withStyles(styles),
  withI18n,
  withTheme
)(({setTheme, currentTheme, themes, classes, i18n: {translate}}) => (
  <Select
    native
    className={classes.select}
    value={currentTheme}
    onChange={(e) => setTheme(e.target.value)}
    input={<OutlinedInput labelWidth={0} />}
  >
    {themes.map((theme) => (
      <option key={theme} value={theme}>
        {translate(themeMessages[theme])}
      </option>
    ))}
  </Select>
))
