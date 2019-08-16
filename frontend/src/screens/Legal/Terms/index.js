// @flow
import React from 'react'
import NoSSR from 'react-no-ssr'

import messages from './messages.en'
import LegalTermsLayout from '../common'

// Note: Not rendered server side as we need to access "location.pathname".
// If that is issue someday, consider parsing pathname on server and storing it in context
// to be consistent between client and server.
export default () => (
  <NoSSR>
    <LegalTermsLayout messages={messages} />
  </NoSSR>
)
