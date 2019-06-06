import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {THEMES} from '../themes'
import localStorage from '../../helpers/localStorage'

export {THEMES, THEME_DEFINITIONS} from '../themes'

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
