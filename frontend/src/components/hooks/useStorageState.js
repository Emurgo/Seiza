// @flow

import {useState, useEffect} from 'react'

import localStorage from '@/helpers/localStorage'
import {useCookiesStorage} from '@/components/context/cookies'

import type {Storage} from '@/helpers/storage'

export const useStorageState = <T>(
  storage: Storage,
  key: string,
  initialState: T,
  options?: {}
): [T, (newState: T) => void | ((state: T) => T)] => {
  const savedState = storage.getItem(key)
  const [state, setState] = useState<T>(savedState || initialState)

  // Note: we could create custom callback and do both updates at once,
  // but then we have to distinguish when setState is called as:
  // setState(value) vs setState((state) => ...)
  // and type it properly.
  // Also useEffect might be proper place to do side-effect action
  useEffect(() => {
    if (storage.getItem(key) !== state) {
      if (options) {
        storage.setItem(key, state, options)
      } else {
        storage.setItem(key, state)
      }
    }
  }, [key, options, state, storage])

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
  initialState: T,
  options?: {} = {}
): [T, (newState: T) => void | ((state: T) => T)] => {
  const cookieStorage = useCookiesStorage()
  return useStorageState<T>(cookieStorage, key, initialState, options)
}
