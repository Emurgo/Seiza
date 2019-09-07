// @flow
import React, {useContext} from 'react'

import {useCallbackRef} from '@/components/hooks/useCallbackRef'

type ContextType = any
export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const SearchbarRefProvider = ({children}: Props) => {
  const {htmlNode, callbackRef} = useCallbackRef()
  return <Context.Provider value={{htmlNode, callbackRef}}>{children}</Context.Provider>
}

export const useSearchbarRef = () => useContext(Context)
