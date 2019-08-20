// @flow

import React, {useContext, useMemo} from 'react'

import {_getStorage} from '@/helpers/storage'

import type {Storage} from '@/helpers/storage'

type ContextType = Storage

export const Context = React.createContext<ContextType>({
  getItem: () => null,
  setItem: () => {
    // do nothing
  },
  removeItem: () => {
    // do nothing
  },
})

type Props = {|
  children: React$Node,
  setCookie: Function,
  destroyCookie: Function,
  getCookies: Function,
|}

// Note: just redirects cookies from next.js `ctx` object wrapped in "cookieStorage".
// Storage is used by `useCookieState`, which should be used for state related stuff
export const CookiesStorageProvider = ({children, setCookie, destroyCookie, getCookies}: Props) => {
  const _cookieStorage = useMemo(
    () => ({
      getItem: (key) => getCookies()[key],
      setItem: setCookie,
      removeItem: destroyCookie,
    }),
    [getCookies, setCookie, destroyCookie]
  )

  const cookieStorage = useMemo(() => _getStorage(_cookieStorage, 'cookie'), [_cookieStorage])

  return <Context.Provider value={cookieStorage}>{children}</Context.Provider>
}

export const useCookiesStorage = () => useContext(Context)
