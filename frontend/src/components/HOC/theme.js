import React, {useContext, useState} from 'react'
import {parseCookies, setCookie} from 'nookies'

// export { THEMES, THEME_DEFINITIONS } from "../themes";
import {THEMES} from '../themes'
const Context = React.createContext({
  setTheme: null,
  currentTheme: null,
})

export const withTheme = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setTheme, currentTheme}) => (
      <WrappedComponent {...props} setTheme={setTheme} currentTheme={currentTheme} />
    )}
  </Context.Consumer>
)

export const getThemeFromCookies = () => parseCookies().theme || ''

// TODO: move out of this file
export const ThemeContextProvider = ({children}) => {
  const [currentTheme, setCurrentTheme] = useState(getThemeFromCookies())
  const setTheme = (newTheme) => {
    setCurrentTheme(newTheme)
    setCookie({}, 'theme', newTheme)
  }
  return (
    <Context.Provider
      value={{
        setTheme,
        currentTheme: Object.values(THEMES).includes(currentTheme) ? currentTheme : THEMES._default,
      }}
    >
      {children}
    </Context.Provider>
  )
}

// TODO: move out of this file
export const useThemeContext = () => {
  return useContext(Context)
}
