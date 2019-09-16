// @flow

import React from 'react'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useBackendSyncingStatus} from '@/components/hooks/useBackendSyncingStatus'
import NotificationPanel from './NotificationPanel'

const text = defineMessages({
  title: 'We are facing syncing issues on the server:',
  dataUpTo: 'Displaying blockchain data up to {date}',
})

export default () => {
  const {translate: tr, formatTimestamp} = useI18n()

  // TODO: do we want to handle error here in any way?
  const {isBehind, syncedUpTo} = useBackendSyncingStatus()

  if (!isBehind) return null

  return (
    <NotificationPanel
      title={tr(text.title)}
      message={tr(text.dataUpTo, {date: formatTimestamp(syncedUpTo)})}
    />
  )
}
