// @flow
import React, {createContext, useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'
import config from '@/config'

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY',
}

type ContextType = [string, Function]
const Context = createContext<ContextType>([CURRENCIES.USD, (currency: string) => null])

type CurrencyProviderProps = {
  children: React$Node,
}

const options = {domain: config.commonCookiesDomain}

export const CurrencyProvider = ({children}: CurrencyProviderProps) => {
  const contextState = useCookieState<string>('currency-domain-cookie', CURRENCIES.USD, options)
  return <Context.Provider value={contextState}>{children}</Context.Provider>
}

export default () => useContext(Context)
