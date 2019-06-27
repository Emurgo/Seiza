// @flow
import React, {useContext, useCallback} from 'react'

import {useLocalStorageState} from '@/components/hooks/useStorageState'

type ContextType = {
  cookiesAccepted: boolean,
  acceptCookies: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const CookiesProvider = ({children}: Props) => {
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorageState<boolean>(
    'acceptCookies',
    false
  )

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true)
  }, [setCookiesAccepted])

  return <Context.Provider value={{cookiesAccepted, acceptCookies}}>{children}</Context.Provider>
}

export const useCookiesContext = () => useContext(Context)
