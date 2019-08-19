// @flow

import React, {useContext} from 'react'

import {useManageSimpleContextValue} from './utils'

import type {ProviderProps} from './utils'
import {isInteger} from '@/helpers/validators'

const STORAGE_KEY = 'userAda'
const DEFAULT_VALUE = ''

type ContextType = {
  userAda: string,
  setUserAda: Function,
  _setUserAdaStorageFromQuery: Function,
  _userAdaStorageToQuery: Function,
  _setUserAdaStorageToDefault: Function,
}

const Context = React.createContext<ContextType>({
  userAda: DEFAULT_VALUE,
  setUserAda: null,
  _setUserAdaStorageFromQuery: null,
  _userAdaStorageToQuery: null,
  _setUserAdaStorageToDefault: null,
})

const parseValue = (v) => (isInteger(v) && v > 0 ? v : '')

export const UserAdaProvider = ({children, autoSync}: ProviderProps) => {
  const {
    value,
    setValue,
    _setStorageFromQuery,
    _storageToQuery,
    _setStorageToDefault,
  } = useManageSimpleContextValue(autoSync, STORAGE_KEY, DEFAULT_VALUE, parseValue)
  return (
    <Context.Provider
      value={{
        userAda: value,
        setUserAda: setValue,
        _userAdaStorageToQuery: _storageToQuery,
        _setUserAdaStorageFromQuery: _setStorageFromQuery,
        _setUserAdaStorageToDefault: _setStorageToDefault,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useUserAdaContext = (): ContextType => useContext(Context)
