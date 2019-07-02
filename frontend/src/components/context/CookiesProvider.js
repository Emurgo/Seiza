// @flow

import React, {useContext} from 'react'

type ContextType = {
  cookies: {},
  setCookie: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
  cookies: {},
  setCookie?: Function,
|}

// Note: just redirects cookies from next.js `ctx` object, so they can be accessed
// from any component
export const CookiesProvider = ({children, cookies, setCookie}: Props) => {
  return <Context.Provider value={{cookies, setCookie}}>{children}</Context.Provider>
}

export const useCookies = () => useContext(Context)
