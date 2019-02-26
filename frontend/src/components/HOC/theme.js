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

const themeDefinitions = {
  [THEMES.BRIGHT]: createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#6300C1',
      },
      secondary: {
        main: '#220049',
      },
      error: red,
    },
  }),
  [THEMES.DARK]: createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      type: 'dark',
      primary: {
        main: '#c5d9f9',
      },
      secondary: {
        main: '#153363',
      },
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
