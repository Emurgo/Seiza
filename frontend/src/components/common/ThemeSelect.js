// @flow

import React from 'react'
import _ from 'lodash'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'

import {useTheme} from '@/components/context/theme'
import {THEME_DEFINITIONS, THEMES} from '@/themes'
import {Select} from '@/components/visual'
import {NavbarLink} from '@/components/common/Navbar'

// Note: keys must be kept synced with THEME_DEFINITIONS keys
export const themeMessages = defineMessages({
  bright: 'Light ',
  dark: 'Dark',
  yoroi: 'Yoroi',
})

const useStyles = makeStyles((theme) => ({
  themeLabelWrapper: {
    display: 'flex',
  },
  themeLabelText: {
    paddingLeft: theme.spacing(1),
  },
}))

const THEME_NAMES = _.values(_.omit(THEMES, '_default'))

// Note: wanted to use `makeStyles/withStyles` and access color props inside,
// however it causes the color to disappear when items was selected for some reason
const ThemeLabel = ({color1, color2, intlMessage}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const THEME_LABEL_SIZE = 20

  const styles = {
    themeLabel: {
      height: THEME_LABEL_SIZE,
      width: THEME_LABEL_SIZE,
      borderRadius: THEME_LABEL_SIZE,
      background: `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`,
    },
  }

  return (
    <div className={classes.themeLabelWrapper}>
      <div style={styles.themeLabel} />
      <NavbarLink className={classes.themeLabelText}>{tr(intlMessage)}</NavbarLink>
    </div>
  )
}

export const themeLabels = {
  [THEMES.BRIGHT]: (
    <ThemeLabel
      color1="#DBEFF8"
      color2={THEME_DEFINITIONS[THEMES.BRIGHT].palette.primary.main}
      intlMessage={themeMessages[THEMES.BRIGHT]}
    />
  ),
  [THEMES.DARK]: (
    <ThemeLabel
      color1={THEME_DEFINITIONS[THEMES.DARK].palette.primary.main}
      color2={THEME_DEFINITIONS[THEMES.DARK].palette.background.default}
      intlMessage={themeMessages[THEMES.DARK]}
    />
  ),
  [THEMES.YOROI]: (
    <ThemeLabel
      color1="#DBEFF8"
      color2={THEME_DEFINITIONS[THEMES.YOROI].palette.primary.main}
      intlMessage={themeMessages[THEMES.YOROI]}
    />
  ),
}

const ThemeSelect = () => {
  const {currentTheme, setTheme} = useTheme()
  return (
    <Select
      hasBorder={false}
      value={currentTheme}
      onChange={(e) => setTheme(e.target.value)}
      options={THEME_NAMES.map((theme) => ({
        value: theme,
        label: themeLabels[theme],
      }))}
    />
  )
}

export default ThemeSelect
