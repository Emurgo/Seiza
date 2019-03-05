import React from 'react'
import _ from 'lodash'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {createMuiTheme} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

import * as storage from '../../helpers/localStorage'

export const THEMES = {
  DARK: 'dark',
  BRIGHT: 'bright',
}

const I18N_PREFIX = 'themes'

export const themeMessages = defineMessages({
  [THEMES.BRIGHT]: {
    id: `${I18N_PREFIX}.bright`,
    defaultMessage: 'Bright',
  },
  [THEMES.DARK]: {
    id: `${I18N_PREFIX}.dark`,
    defaultMessage: 'Dark',
  },
})

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

// Note: Footer design does not play well with primary or secondary color
const themeDefinitions = {
  [THEMES.BRIGHT]: createMuiTheme({
    typography: {
      useNextVariants: true,
      fontFamily: fontFamilies,
    },
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
        main: '#6300C1',
      },
      secondary: {
        main: '#EFE5F9',
      },
      footer: '#220049',
      error: red,
    },
  }),
  [THEMES.DARK]: createMuiTheme({
    typography: {
      useNextVariants: true,
      fontFamily: fontFamilies,
    },
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
      primary: {
        main: '#c5d9f9',
      },
      secondary: {
        main: '#153363',
      },
      footer: '#220049',
      error: red,
    },
  }),
}

const Context = React.createContext({
  setTheme: null,
  theme: null,
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
        themes: _.values(THEMES),
        themeDefinitions,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  ))

export const withTheme = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setTheme, currentTheme, themes, themeDefinitions}) => (
      <WrappedComponent
        {...props}
        setTheme={setTheme}
        currentTheme={currentTheme}
        themes={themes}
        themeDefinitions={themeDefinitions}
      />
    )}
  </Context.Consumer>
)
