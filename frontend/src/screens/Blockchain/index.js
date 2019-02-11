import React from 'react'
import {injectIntl, defineMessages} from 'react-intl'

import RecentBlocks from './RecentBlocks'

const messages = defineMessages({
  header: {
    id: 'blockchain.header',
    defaultMessage: 'Blockchain',
  },
})

const Blockchain = (props) => {
  const {
    intl: {formatMessage},
  } = props
  return (
    <React.Fragment>
      <h1>{formatMessage(messages.header)}</h1>
      <RecentBlocks />
    </React.Fragment>
  )
}

export default injectIntl(Blockchain)
