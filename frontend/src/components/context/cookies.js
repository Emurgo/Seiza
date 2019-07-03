// @flow

import React, {useContext} from 'react'

type ContextType = {
  cookies: {},
  setCookie: Function,
  destroyCookie: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
  cookies: {},
  setCookie: Function,
  destroyCookie: Function,
|}

// Note: just redirects cookies from next.js `ctx` object, so they can be accessed
// from any component
export const CookiesProvider = ({children, cookies, setCookie, destroyCookie}: Props) => {
  return <Context.Provider value={{cookies, setCookie, destroyCookie}}>{children}</Context.Provider>
}

export const useCookies = () => useContext(Context)
