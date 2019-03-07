import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {IntlProvider, addLocaleData} from 'react-intl'
import * as storage from '../../helpers/localStorage'

// Note: see https://medium.com/@shalkam/create-react-app-i18n-the-easy-way-b05536c594cb
// for more info

// Note: for demonstration
import jaLocaleData from 'react-intl/locale-data/ja'
import ruLocaleData from 'react-intl/locale-data/ru'

import translations from '../../i18n/locales'

// Note: for demonstration
// Note: This needs to be added otherwise react-intl doesn't know about locale even if you provide
// translations
addLocaleData(jaLocaleData)
addLocaleData(ruLocaleData)

const Context = React.createContext({
  setLanguage: null,
  locale: null,
})

export const provideIntl = (WrappedComponent) =>
  compose(
    withState('locale', 'setLocale', storage.getItem('locale') || 'en'),
    withHandlers({
      setLocale: ({setLocale}) => (newLocale) => {
        setLocale(newLocale)
        storage.setItem('locale', newLocale)
      },
    })
  )(({locale, setLocale, ...props}) => (
    <IntlProvider locale={locale} key={locale} messages={translations[locale]}>
      <Context.Provider
        value={{
          setLocale,
          locale,
        }}
      >
        <WrappedComponent {...props} />
      </Context.Provider>
    </IntlProvider>
  ))

export const withSetLocale = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setLocale, locale}) => <WrappedComponent {...props} setLocale={setLocale} locale={locale} />}
  </Context.Consumer>
)
