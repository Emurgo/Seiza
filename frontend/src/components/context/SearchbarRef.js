// @flow
import React, {useRef, useContext} from 'react'

type ContextType = any
export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const SearchbarRefProvider = ({children}: Props) => {
  const ref = useRef(null)
  return <Context.Provider value={ref}>{children}</Context.Provider>
}

export const useSearchbarRefContext = () => useContext(Context)
