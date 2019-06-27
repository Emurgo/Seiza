import {createMuiTheme} from '@material-ui/core'

import muiTransitions from '@material-ui/core/styles/transitions'

import {defaultShadowsDefs, createShadow} from './shadows'

// https://stackoverflow.com/questions/52472372/responsive-typography-in-material-ui
const breakpoints = createMuiTheme({}).breakpoints

const xsMobile = breakpoints.down('xs')

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

const common = {
  typography: {
    useNextVariants: true,
    fontFamily: makeFontFamilies(FF.normal),
    fontSize: 16,
    opaqueText: {
      opacity: 0.54,
    },
    h1: {
      fontSize: 36,
      fontWeight: 700,
      // Note: for demostration, consider using mobile first in practise
      [xsMobile]: {
        fontSize: 30,
      },
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
    },
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
