import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {createMuiTheme} from '@material-ui/core/styles'

import * as storage from '../../helpers/localStorage'

// Note: keep synced with theme select intl keys
export const THEMES = {
  BRIGHT: 'bright',
  DARK: 'dark',
}

// TODO: Which font families to fallback to?
const fontFamilies = [
  'Montserrat',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

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
      letterSpacing: 2,
    },
    caption: {
      fontSize: 12,
    },
    overline: {
      letterSpacing: 1.5,
      fontSize: 13,
      lineHeight: 1.5,
    },
  },
}

// Note: Footer design does not play well with primary or secondary color
// TODO: create common theme properties
export const THEME_DEFINITIONS = {
  [THEMES.BRIGHT]: createMuiTheme({
    ...commonThemeObj,
    palette: {
      gradient: 'linear-gradient(97deg, #BFADE7 0%, #E0F1F8 100%)',
      buttonsGradient: {
        direction: 97,
        start: '#715BD3',
        end: '#95BAF7',
        startPercent: 0,
        endPercent: 100,
        gradient: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
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
      contentFocus: '#8791AD',
      contentUnfocus: '#BFC5D2',
      unobtrusiveContentHighlight: '#F4F6FC',
      disabled: 'rgba(146, 185, 252, 0.05)',
    },
  }),
  [THEMES.DARK]: createMuiTheme({
    ...commonThemeObj,
    palette: {
      type: 'dark',
      gradient: 'linear-gradient(97deg, #00050c 0%, #5a5c60 100%)',
      buttonsGradient: {
        direction: 97,
        start: '#3a404c',
        end: '#b7b9bc',
        startPercent: 0,
        endPercent: 100,
        gradient: 'linear-gradient(97deg, #3a404c 0%, #b7b9bc 100%)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#8791AD',
      },
      primary: {
        main: '#c5d9f9',
      },
      secondary: {
        main: '#153363',
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
      contentFocus: '#8791AD',
      contentUnfocus: '#BFC5D2',
      unobtrusiveContentHighlight: '#F4F6FC',
      disabled: 'rgba(146, 185, 252, 0.05)',
    },
  }),
}

const Context = React.createContext({
  setTheme: null,
  currentTheme: null,
})

export const provideTheme = (WrappedComponent) =>
  compose(
    withState('currentTheme', 'setTheme', storage.getItem('theme') || THEMES.BRIGHT),
    withHandlers({
      setTheme: ({setTheme}) => (newTheme) => {
        setTheme(newTheme)
        storage.setItem('theme', newTheme)
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
