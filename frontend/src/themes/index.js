import {createMuiTheme} from '@material-ui/core/styles'

import bright from './bright'
import testnet from './testnet'
import dark from './dark'
import yoroi from './yoroi'

// Note: keep synced with theme select intl keys
export const THEMES = {
  _default: 'bright',
  BRIGHT: 'bright',
  DARK: 'dark',
  YOROI: 'yoroi',
  TESTNET: 'testnet',
}

export const THEME_DEFINITIONS = {
  [THEMES.BRIGHT]: createMuiTheme(bright),
  [THEMES.DARK]: createMuiTheme(dark),
  [THEMES.YOROI]: createMuiTheme(yoroi),
  [THEMES.TESTNET]: createMuiTheme(testnet),
}
