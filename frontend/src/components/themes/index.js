import {createMuiTheme} from '@material-ui/core/styles'

import bright from './bright'
import dark from './dark'

// Note: keep synced with theme select intl keys
export const THEMES = {
  BRIGHT: 'bright',
  DARK: 'dark',
}

export const THEME_DEFINITIONS = {
  [THEMES.BRIGHT]: createMuiTheme(bright),
  [THEMES.DARK]: createMuiTheme(dark),
}

