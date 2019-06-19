import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import localStorage from '../../helpers/localStorage'
import {THEMES} from '../themes'

export {THEMES, THEME_DEFINITIONS} from '../themes'

const Context = React.createContext({
  setTheme: null,
  currentTheme: null,
})

export const provideTheme = (WrappedComponent) =>
  compose(
    withState('currentTheme', 'setTheme', localStorage.getItem('theme') || ''),
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
        currentTheme: Object.values(THEMES).includes(currentTheme) ? currentTheme : THEMES._default,
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
