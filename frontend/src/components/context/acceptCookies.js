// @flow
import React, {useContext, useCallback} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

type ContextType = {
  cookiesAccepted: boolean,
  acceptCookies: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const AcceptCookiesProvider = ({children}: Props) => {
  const [cookiesAccepted, setCookiesAccepted] = useCookieState<boolean>('acceptCookies', false)

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true)
  }, [setCookiesAccepted])

  return <Context.Provider value={{cookiesAccepted, acceptCookies}}>{children}</Context.Provider>
}

export const useAcceptCookies = () => useContext(Context)
