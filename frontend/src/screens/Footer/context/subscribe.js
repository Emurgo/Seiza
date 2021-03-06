// @flow
import React, {useContext, useCallback} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'
import config from '@/config'

type ContextType = {
  hidden: boolean,
  setHidden: Function,
  showSubscribe: Function,
  hideSubscribe: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

const options = {domain: config.commonCookiesDomain}

export const SubscribeProvider = ({children}: Props) => {
  const [hidden, setHidden] = useCookieState<boolean>(
    'subscribedToNewsletter-domain-cookie',
    false,
    options
  )

  const hideSubscribe = useCallback(() => {
    setHidden(true)
  }, [setHidden])

  const showSubscribe = useCallback(() => {
    setHidden(false)
  }, [setHidden])

  return (
    <Context.Provider value={{hidden, setHidden, hideSubscribe, showSubscribe}}>
      {children}
    </Context.Provider>
  )
}

export const useSubscribe = () => useContext(Context)
