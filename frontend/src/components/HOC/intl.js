import React from 'react'
import {compose} from 'redux'
import {withState, withHandlers} from 'recompose'
import {IntlProvider, addLocaleData} from 'react-intl'
import * as storage from '../../helpers/localStorage'

// Note: see https://medium.com/@shalkam/create-react-app-i18n-the-easy-way-b05536c594cb
// for more info

// Note: for demonstration (spain)
import esLocaleData from 'react-intl/locale-data/es'

import translations from '../../i18n/locales'

// Note: for demonstration
addLocaleData(esLocaleData)

const Context = React.createContext({
  setLanguage: null,
})

export const withIntl = (WrappedComponent) =>
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
        }}
      >
        <WrappedComponent {...props} />
      </Context.Provider>
    </IntlProvider>
  ))

export const withSetLocale = (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({setLocale}) => <WrappedComponent {...props} setLocale={setLocale} />}
  </Context.Consumer>
)
