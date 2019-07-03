// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

// TODO: consider to unify file names in "context" folder

type ContextType = {
  setLocale: Function,
  locale: string,
}

const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const IntlProvider = ({children}: Props) => {
  const [locale, setLocale] = useCookieState('locale', 'en')

  return (
    <Context.Provider
      value={{
        setLocale,
        locale,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useLocale = () => useContext(Context)
