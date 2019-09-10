// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

import {THEMES} from '@/themes'
import config from '@/config'

type ContextType = {
  setTheme: Function,
  currentTheme: string,
}

const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

const getTheme = (themeFromCookies) => {
  if (config.isYoroi) {
    return THEMES.YOROI
  } else {
    return Object.values(THEMES).includes(themeFromCookies) ? themeFromCookies : THEMES._default
  }
}

export const ThemeProvider = ({children}: Props) => {
  const [currentTheme, setTheme] = useCookieState<string>('theme', THEMES._default)

  return (
    <Context.Provider
      value={{
        setTheme,
        currentTheme: getTheme(currentTheme),
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useTheme = () => useContext(Context)
