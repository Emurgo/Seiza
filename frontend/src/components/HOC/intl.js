import React from 'react'
import {IntlProvider, addLocaleData} from 'react-intl'

// Note: see https://medium.com/@shalkam/create-react-app-i18n-the-easy-way-b05536c594cb
// for more info

// Note: for demonstration (spain)
import esLocaleData from 'react-intl/locale-data/es'

import translations from '../../i18n/locales'

// Note: for demonstration
addLocaleData(esLocaleData)

export const withIntl = (WrappedComponent) => (props) => {
  const locale = 'en' // TODO: load from localStorage
  const messages = translations[locale]
  
  return (
  <IntlProvider locale={locale} key={locale} messages={messages}>
    <WrappedComponent {...props} />
  </IntlProvider>
)}
