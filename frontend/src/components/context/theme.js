// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

import {THEMES} from '../themes'

// TODO: consider to unify file names in "context" folder

type ContextType = {
  setTheme: Function,
  currentTheme: string,
}

const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const ThemeContextProvider = ({children}: Props) => {
  const [currentTheme, setTheme] = useCookieState<string>('theme', THEMES._default)

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

export const useTheme = () => useContext(Context)
