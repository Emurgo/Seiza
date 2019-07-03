import React, {useContext, useState} from 'react'

import {useCookies} from '@/components/context/CookiesProvider'

const Context = React.createContext({
  setLanguage: null,
  locale: null,
})

export const withSetLocale = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setLocale, locale}) => <WrappedComponent {...props} setLocale={setLocale} locale={locale} />}
  </Context.Consumer>
)

// TODO: move this out of this file
export const IntlContextProvider = ({children}) => {
  const {cookies, setCookie} = useCookies()
  const [locale, setLocale] = useState(cookies.locale || 'en')
  const setLocaleHandler = (newLocale) => {
    setLocale(newLocale)
    setCookie('locale', newLocale)
  }
  return (
    <Context.Provider
      value={{
        setLocale: setLocaleHandler,
        locale,
      }}
    >
      {children}
    </Context.Provider>
  )
}

// TODO: move this out of this file
export const useLocale = () => {
  return useContext(Context)
}
