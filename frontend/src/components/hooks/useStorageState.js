// @flow

import {useState, useEffect, useMemo} from 'react'

import localStorage from '@/helpers/localStorage'
import {useCookies} from '@/components/context/CookiesProvider'
import {_getStorage} from '@/helpers/storage'

import type {Storage} from '@/helpers/storage'

export const useStorageState = <T>(
  storage: Storage,
  key: string,
  initialState: T
): [T, (newState: T) => void | ((state: T) => T)] => {
  const savedState = storage.getItem(key)
  const [state, setState] = useState<T>(savedState || initialState)

  // Note: we could create custom callback and do both updates at once,
  // but then we have to distinguish when setState is called as:
  // setState(value) vs setState((state) => ...)
  // and type it properly.
  // Also useEffect might be proper place to do side-effect action
  useEffect(() => storage.setItem(key, state), [key, state, storage])

  return [state, setState]
}

export const useLocalStorageState = <T>(
  key: string,
  initialState: T
): [T, (newState: T) => void | ((state: T) => T)] => {
  return useStorageState<T>(localStorage, key, initialState)
}

export const useCookieState = <T>(
  key: string,
  initialState: T
): [T, (newState: T) => void | ((state: T) => T)] => {
  const {cookies, setCookie, destroyCookie} = useCookies()
  const _cookieStorage = useMemo(
    () => ({
      getItem: (key) => cookies[key],
      setItem: (key, value) => setCookie(key, value),
      removeItem: (key) => destroyCookie(key),
    }),
    [cookies, setCookie, destroyCookie]
  )
  const cookieStorage = useMemo(() => _getStorage(_cookieStorage, 'cookie'), [_cookieStorage])
  return useStorageState<T>(cookieStorage, key, initialState)
}
