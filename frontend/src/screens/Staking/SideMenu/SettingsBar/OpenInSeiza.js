import React from 'react'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Link} from '@/components/common'

const messages = defineMessages({
  openInSeiza: 'Open in Seiza',
})

const OpenInSeiza = ({link}) => {
  const {translate: tr} = useI18n()
  return (
    <Link external underline="always" target="_blank" to={link}>
      {tr(messages.openInSeiza)}
    </Link>
  )
}

export default OpenInSeiza
