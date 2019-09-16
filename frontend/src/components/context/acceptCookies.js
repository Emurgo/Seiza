// @flow
import React, {useContext, useCallback} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'
import config from '@/config'

type ContextType = {
  cookiesAccepted: boolean,
  acceptCookies: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

const options = {domain: config.commonCookiesDomain}

export const AcceptCookiesProvider = ({children}: Props) => {
  const [cookiesAccepted, setCookiesAccepted] = useCookieState<boolean>(
    'acceptCookies-domain-cookie',
    false,
    options
  )

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true)
  }, [setCookiesAccepted])

  return <Context.Provider value={{cookiesAccepted, acceptCookies}}>{children}</Context.Provider>
}

export const useAcceptCookies = () => useContext(Context)
