// @flow
import React, {createContext, useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

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
export const CurrencyProvider = ({children}: CurrencyProviderProps) => {
  const contextState = useCookieState<string>('currency', CURRENCIES.USD)
  return <Context.Provider value={contextState}>{children}</Context.Provider>
}

export default () => useContext(Context)
