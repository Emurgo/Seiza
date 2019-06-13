// @flow
import React, {createContext, useContext, useCallback, useState} from 'react'
import localStorage from '@/helpers/localStorage'

const retrieveCurrency = () => localStorage.getItem('currency')
const saveCurrency = (currency) => localStorage.setItem('currency', currency)

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY',
}

const defaultCurrency = retrieveCurrency() || CURRENCIES.USD

type ContextType = [string, Function]
const Context = createContext<ContextType>([CURRENCIES.USD, (currency: string) => null])

type CurrencyProviderProps = {
  children: React$Node,
}
export const CurrencyProvider = ({children}: CurrencyProviderProps) => {
  const contextState = useState(defaultCurrency)
  return <Context.Provider value={contextState}>{children}</Context.Provider>
}

export default () => {
  const [currency, setCurrency] = useContext(Context)
  const setAndSaveCurrency = useCallback(
    (currency: string) => {
      setCurrency(currency)
      saveCurrency(currency)
    },
    [setCurrency]
  )

  return [currency, setAndSaveCurrency]
}
