import React, {useContext, useState} from 'react'
import {parseCookies, setCookie} from 'nookies'

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
  const [locale, setLocale] = useState(parseCookies().locale || 'en')
  const setLocaleHandler = (newLocale) => {
    setLocale(newLocale)
    setCookie({}, 'locale', newLocale)
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
