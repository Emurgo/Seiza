// @flow

import React, {useContext} from 'react'

import {useCallbackRef} from '@/components/hooks/useCallbackRef'

// TODO: type
type ContextType = {
  scrollableWrapperNode: any,
  scrollableWrapperRef: any,
}

const Context = React.createContext<ContextType>({})

type ProviderProps = {|
  children: React$Node,
|}

export const ScrollableWrapperRefProvider = ({children, onChange}: ProviderProps) => {
  const {htmlNode: scrollableWrapperNode, callbackRef: scrollableWrapperRef} = useCallbackRef()
  return (
    <Context.Provider value={{scrollableWrapperNode, scrollableWrapperRef}}>
      {children}
    </Context.Provider>
  )
}

export const useScrollableWrapperRef = () => useContext(Context)
