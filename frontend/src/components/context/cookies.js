// @flow

import React, {useContext, useState, useCallback} from 'react'

type ContextType = {
  cookies: {},
  setCookie: Function,
  destroyCookie: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
  setCookie: Function,
  destroyCookie: Function,
  getCookies: Function,
|}

// Note: just redirects cookies from next.js `ctx` object, so they can be accessed
// from any component
export const CookiesProvider = ({children, setCookie, destroyCookie, getCookies}: Props) => {
  // We need to store cookies also in state, as cookies passed
  // from _app are not passed again when changed
  const [cookiesState, setCookiesState] = useState(getCookies())

  const _setCookie = useCallback(
    (...args) => {
      setCookie(...args)
      const currentCookies = getCookies()
      setCookiesState(currentCookies)
    },
    [getCookies, setCookie]
  )

  const _destroyCookie = useCallback(
    (...args) => {
      destroyCookie(...args)
      const currentCookies = getCookies()
      setCookiesState(currentCookies)
    },
    [destroyCookie, getCookies]
  )

  return (
    <Context.Provider
      value={{cookies: cookiesState, setCookie: _setCookie, destroyCookie: _destroyCookie}}
    >
      {children}
    </Context.Provider>
  )
}

export const useCookies = () => useContext(Context)
