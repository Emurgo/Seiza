import muiTransitions from '@material-ui/core/styles/transitions'

import {defaultShadowsDefs, createShadow} from './shadows'

/*
// For responsive font-size across the app
// https://stackoverflow.com/questions/52472372/responsive-typography-in-material-ui
import {createMuiTheme} from '@material-ui/core'
const breakpoints = createMuiTheme({}).breakpoints
// use in theme definition
const desktopFontBreakpoint = breakpoints.up('sm')
}
*/

const makeFontFamilies = (fontFamilies) => fontFamilies.map((ff) => `"${ff}"`).join(',')

// TODO: Which font families to fallback to?

const FF = {
  normal: [
    'Roboto',
    'Roboto Self',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  monospace: ['Roboto Mono', 'Roboto Mono Self', 'Monaco', 'monospace'],
}

const DEFAULT_SPACING = 8 // 8 because that's material-ui default theme.spacing(1)
const CONTENT_SPACING = 4 * DEFAULT_SPACING

const common = {
  typography: {
    useNextVariants: true,
    fontFamily: makeFontFamilies(FF.normal),
    fontSize: 16, // Note: this can not be set based on breakpoints
    opaqueText: {
      opacity: 0.54,
    },
    h1: {
      fontSize: 36,
      fontWeight: 700,
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
    },
    h5: {
      fontSize: 18,
      fontWeight: 700,
    },
    // Material default typography
    body1: {
      fontSize: 16,
    },
    // ???: is this ever used?
    button: {
      fontWeight: 700,
      letterSpacing: 1,
    },
    caption: {
      fontSize: 12,
    },
    overline: {
      letterSpacing: 1,
      fontSize: 13,
      lineHeight: 1.5,
    },
    // This is our custom style. <Typography /> does not support it
    // but it is useful to have it here
    _monospace: {
      fontFamily: makeFontFamilies(FF.monospace),
    },
    _ellipsize: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  hover: {
    transitionIn: (cssProps, duration = 100) =>
      muiTransitions.create(cssProps, {
        duration,
      }),
    transitionOut: (cssProps, duration = 500) =>
      muiTransitions.create(cssProps, {
        duration,
      }),
  },
  shadows: ['none', ...defaultShadowsDefs.map((px) => createShadow('#412596', px))],
  getContentSpacing: (factor = 1) => factor * CONTENT_SPACING,
  overrides: {
    MuiOutlinedInput: {
      root: {
        '& input::placeholder': {
          color: '#8A93AF',
        },
      },
    },
    MuiCssBaseline: {
      '@global': {
        strong: {
          fontWeight: 'bold',
        },
      },
    },
  },
}

export default common
