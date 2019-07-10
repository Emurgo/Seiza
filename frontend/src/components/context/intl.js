// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'
import {LANGUAGES} from '@/components/common/LanguageSelect'

type ContextType = {
  setLocale: Function,
  locale: string,
}

const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const DEFAULT_LOCALE = 'en'

export const LOCALE_KEY = 'locale'

export const getValidatedLocale = (locale: string) =>
  LANGUAGES.some((conf) => conf.value === locale) ? locale : DEFAULT_LOCALE

export const IntlProvider = ({children}: Props) => {
  const [locale, setLocale] = useCookieState(LOCALE_KEY, DEFAULT_LOCALE)

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
