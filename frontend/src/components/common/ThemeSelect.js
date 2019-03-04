// @flow

import React from 'react'
import {compose} from 'redux'
import {withStyles} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'
import {withTheme, themeMessages} from '@/components/HOC/theme'
import {Select} from '@/components/visual'

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    width: '90px',
  },
})

export default compose(
  withStyles(styles),
  withI18n,
  withTheme
)(({setTheme, currentTheme, themes, classes, i18n: {translate}}) => (
  <Select
    className={classes.select}
    value={currentTheme}
    onChange={(e) => setTheme(e.target.value)}
    options={themes.map((theme) => ({
      value: theme,
      label: translate(themeMessages[theme]),
    }))}
  />
))
