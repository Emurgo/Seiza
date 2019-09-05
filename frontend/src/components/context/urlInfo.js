// @flow
import React, {useContext} from 'react'

type ContextType = {
  domain: string,
  origin: string,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
  urlInfo: ContextType,
|}

export const UrlInfoProvider = ({children, urlInfo}: Props) => {
  return <Context.Provider value={urlInfo}>{children}</Context.Provider>
}

export const useUrlInfo = () => useContext(Context)
