// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

import {THEMES} from '@/themes'
import {useUrlInfo} from '@/components/context/urlInfo'
import {getCurrentBlockchainNetwork} from '@/helpers/testnet'
import config from '@/config'

type ContextType = {
  setTheme: Function,
  currentTheme: string,
}

const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

const getTheme = (themeFromCookies, isTestnet) => {
  if (isTestnet) {
    return THEMES.TESTNET
  } else if (config.isYoroi) {
    return THEMES.YOROI
  } else {
    return Object.values(THEMES).includes(themeFromCookies) ? themeFromCookies : THEMES._default
  }
}

const useGetIsTestnet = () => {
  const {origin} = useUrlInfo()

  if (!config.enableTestnet) return false

  const currentBlockchainNetwork = getCurrentBlockchainNetwork(origin)
  return !currentBlockchainNetwork.isMainnet
}

export const ThemeProvider = ({children}: Props) => {
  const isTestnet = useGetIsTestnet()

  const [currentTheme, setTheme] = useCookieState<string>('theme', THEMES._default)

  return (
    <Context.Provider
      value={{
        setTheme,
        currentTheme: getTheme(currentTheme, isTestnet),
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useTheme = () => useContext(Context)
