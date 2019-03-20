// @flow

import React from 'react'
import _ from 'lodash'
import {compose} from 'redux'
import {withStyles} from '@material-ui/core'

import {withI18n} from '@/i18n/helpers'
import {withTheme, THEME_DEFINITIONS, THEMES} from '@/components/HOC/theme'
import {Select} from '@/components/visual'

const THEME_ARRAY = _.values(THEMES)

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    width: '60px',
  },
})

// Note: wanted to use `makeStyles` and access color props inside, however it causes the color
// to disappear when items was selected for some reason
const ThemeLabel = (props) => {
  const THEME_LABEL_SIZE = 20
  const styles = {
    themeLabel: {
      height: THEME_LABEL_SIZE,
      width: THEME_LABEL_SIZE,
      borderRadius: THEME_LABEL_SIZE,
      background: `linear-gradient(to right, ${props.color1} 0%, ${props.color2} 100%)`,
    },
  }

  return <div style={styles.themeLabel} />
}

export const themeLabels = {
  [THEMES.BRIGHT]: (
    <ThemeLabel color1="#DBEFF8" color2={THEME_DEFINITIONS[THEMES.BRIGHT].palette.primary.main} />
  ),
  [THEMES.DARK]: (
    <ThemeLabel color1={'white'} color2={THEME_DEFINITIONS[THEMES.DARK].palette.secondary.main} />
  ),
}
export default compose(
  withStyles(styles),
  withI18n,
  withTheme
)(({setTheme, currentTheme, classes, i18n: {translate}}) => (
  <Select
    hasBorder={false}
    className={classes.select}
    value={currentTheme}
    onChange={(e) => setTheme(e.target.value)}
    options={THEME_ARRAY.map((theme) => ({
      value: theme,
      label: themeLabels[theme],
    }))}
  />
))
