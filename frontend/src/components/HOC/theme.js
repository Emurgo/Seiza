import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {createMuiTheme} from '@material-ui/core/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import muiTransitions from '@material-ui/core/styles/transitions'

import localStorage from '../../helpers/localStorage'

// Note: keep synced with theme select intl keys
export const THEMES = {
  BRIGHT: 'bright',
  DARK: 'dark',
}

// TODO: Which font families to fallback to?
const fontFamilies = [
  'Roboto',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

const monospaceFontFamilies = ['"RobotoMono"', 'Monaco', 'monospace'].join(',')

// taken from material-ui's github
// packages/material-ui/src/styles/shadows.js
const shadowKeyUmbraOpacity = 0.2
const shadowKeyPenumbraOpacity = 0.14
const shadowAmbientShadowOpacity = 0.12

const getShadowColors = (color) => [
  fade(color, shadowKeyUmbraOpacity),
  fade(color, shadowKeyPenumbraOpacity),
  fade(color, shadowAmbientShadowOpacity),
]

const DEFAULT_SHADOW_COLORS = getShadowColors('#000000')
function createShadow(shadowColors = DEFAULT_SHADOW_COLORS, ...px) {
  return [
    `${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px ${shadowColors[0]}`,
    `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px ${shadowColors[1]}`,
    `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px ${shadowColors[2]}`,
  ].join(',')
}

// TODO: adjust for dark theme
const SHADOW_COLORS = getShadowColors('#412596')

const commonThemeObj = {
  typography: {
    useNextVariants: true,
    fontFamily: fontFamilies,
    fontSize: 16,
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
      fontFamily: monospaceFontFamilies,
    },
  },
  hover: {
    transitionIn: (cssProps) =>
      muiTransitions.create(cssProps, {
        duration: 100,
      }),
    transitionOut: (cssProps) =>
      muiTransitions.create(cssProps, {
        duration: 500,
      }),
  },
  shadows: [
    'none',
    createShadow(SHADOW_COLORS, 0, 1, 3, 0, 0, 1, 1, 0, 0, 2, 1, -1),
    createShadow(SHADOW_COLORS, 0, 1, 5, 0, 0, 2, 2, 0, 0, 3, 1, -2),
    createShadow(SHADOW_COLORS, 0, 1, 8, 0, 0, 3, 4, 0, 0, 3, 3, -2),
    createShadow(SHADOW_COLORS, 0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
    createShadow(SHADOW_COLORS, 0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
    createShadow(SHADOW_COLORS, 0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
    createShadow(SHADOW_COLORS, 0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
    createShadow(SHADOW_COLORS, 0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
    createShadow(SHADOW_COLORS, 0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
    createShadow(SHADOW_COLORS, 0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
    createShadow(SHADOW_COLORS, 0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
    createShadow(SHADOW_COLORS, 0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
    createShadow(SHADOW_COLORS, 0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
    createShadow(SHADOW_COLORS, 0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
    createShadow(SHADOW_COLORS, 0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
    createShadow(SHADOW_COLORS, 0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
    createShadow(SHADOW_COLORS, 0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
    createShadow(SHADOW_COLORS, 0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
    createShadow(SHADOW_COLORS, 0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
    createShadow(SHADOW_COLORS, 0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
    createShadow(SHADOW_COLORS, 0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
    createShadow(SHADOW_COLORS, 0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
    createShadow(SHADOW_COLORS, 0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
    createShadow(SHADOW_COLORS, 0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8),
  ],
}

// Note: Footer design does not play well with primary or secondary color
// TODO: create common theme properties
export const THEME_DEFINITIONS = {
  [THEMES.BRIGHT]: createMuiTheme({
    ...commonThemeObj,
    palette: {
      gradient: 'linear-gradient(97deg, #BFADE7 0%, #E0F1F8 100%)',
      buttonsGradient: {
        normal: 'linear-gradient(90deg, #4D20C0 0%,  #92A7FC 67%, #B1E1F2 100%)',
        hover: 'linear-gradient(90deg, #4D20C0 0%,  #4D20C0 100%)',
      },
      primary: {
        main: '#4D20C0',
      },
      // Note:
      // <Typography color="primary"> ---> selects palette.primary.main
      // <Typography color="secondary"> ---> selects palette.secondary.main
      // <Typography color="textPrimary"> ---> selects palette.text.primary
      // <Typography color="textSecondary"> ---> selects palette.text.secondary
      text: {
        primary: '#120546',
        secondary: '#8791AD',
      },
      secondary: {
        main: 'rgba(77, 32, 192, 0.1)', // or #E7E4F8 ?
      },
      tertiary: {
        main: '#92B9FC', // underscore of navbar, icons have it
      },
      quaternary: {
        main: '#B1E1F2', // color of one of lines in graph
      },
      footer: {
        link: '#6F7290',
        contrastText: '#FFFFFF',
        background: '#120546',
      },
      warning: {
        color: '#FF805D',
        background: '#FFE2DA',
      },
      alertWeak: '#F9D8E6', // TODO: confirm with Marta
      alertStrong: {
        color: '#FF1755',
        background: '#F9E9F2',
      },
      emphasis: {
        color: '#8AE8D4',
        background: '#EAF8F9',
      },
      noResults: {
        color: '#C9BEF1',
        background: '#CEC0F2',
      },
      background: {
        paperContrast: '#F4F5FC',
        paper: '#FFFFFF',
        default: '#F9FAFF',
      },
      contentFocus: '#8791AD',
      contentUnfocus: '#BFC5D2',
      unobtrusiveContentHighlight: '#F4F6FC',
      disabled: 'rgba(146, 185, 252, 0.05)',
      adaValue: {
        positive: '#5FDBC1',
        negative: '#FF1755',
        neutral: '#120546',
      },
      shadowBase: '#412596',
    },
  }),
  [THEMES.DARK]: createMuiTheme({
    ...commonThemeObj,
    palette: {
      type: 'dark',
      gradient: 'linear-gradient(97deg, #8673EC 0%, #99B0EA 100%)',
      buttonsGradient: {
        direction: 97,
        start: '#715BD3',
        end: '#95BAF7',
        startPercent: 0,
        endPercent: 100,
        gradient: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
      },
      primary: {
        main: '#90ACFE',
      },
      secondary: {
        main: 'rgb(21, 51, 99, 0.3)',
      },
      tertiary: {
        main: '#92B9FC', // underscore of navbar, icons have it
      },
      quaternary: {
        main: '#B1E1F2', // color of one of lines in graph
      },
      footer: {
        link: '#6F7290',
        contrastText: '#FFFFFF',
        background: '#220049',
      },
      warning: {
        color: '#FF805D',
        background: '#FFE2DA',
      },
      alertWeak: '#F9D8E6', // TODO: confirm with Marta
      alertStrong: {
        color: '#FF1755',
        background: '#F9E9F2',
      },
      emphasis: {
        color: '#8AE8D4',
        background: '#EAF8F9',
      },
      noResults: {
        color: '#C9BEF1',
        background: '#CEC0F2',
      },
      background: {
        default: '#34005A',
        paper: '#3D1769',
        paperContrast: '#220049',
      },
      contentFocus: '#8791AD',
      contentUnfocus: '#BFC5D2',
      unobtrusiveContentHighlight: '#6F5B93',
      disabled: 'rgba(146, 185, 252, 0.05)',
      adaValue: {
        positive: '#5FDBC1',
        negative: '#FF1755',
        neutral: '#ffffff',
      },
      shadowBase: '#412596',
    },
  }),
}

const Context = React.createContext({
  setTheme: null,
  currentTheme: null,
})

export const provideTheme = (WrappedComponent) =>
  compose(
    withState('currentTheme', 'setTheme', localStorage.getItem('theme') || THEMES.BRIGHT),
    withHandlers({
      setTheme: ({setTheme}) => (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
      },
    })
  )(({currentTheme, setTheme, ...props}) => (
    <Context.Provider
      value={{
        setTheme,
        currentTheme,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withTheme = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setTheme, currentTheme}) => (
      <WrappedComponent {...props} setTheme={setTheme} currentTheme={currentTheme} />
    )}
  </Context.Consumer>
)
