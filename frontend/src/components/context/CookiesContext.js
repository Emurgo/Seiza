// @flow
import React, {useContext, useCallback} from 'react'

import useLocalStorage from '@/components/hooks/useLocalStorage'

type ContextType = {
  cookiesAccepted: boolean,
  acceptCookies: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const CookiesProvider = ({children}: Props) => {
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage('acceptCookies', false)

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true)
  }, [setCookiesAccepted])

  return <Context.Provider value={{cookiesAccepted, acceptCookies}}>{children}</Context.Provider>
}

export const useCookiesContext = () => useContext(Context)
