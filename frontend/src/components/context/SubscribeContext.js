// @flow
import React, {useContext, useCallback} from 'react'

import useLocalStorage from '@/components/hooks/useLocalStorage'

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

export const SubscribeProvider = ({children}: Props) => {
  const [hidden, setHidden] = useLocalStorage('subscribedToNewsletter', false)

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

export const useSubscribeContext = () => useContext(Context)