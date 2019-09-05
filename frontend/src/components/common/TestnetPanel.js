// @flow

import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import NotificationPanel from './NotificationPanel'
import {useUrlInfo} from '@/components/context/urlInfo'

import {Link} from '@/components/common'
import {getMainnetUrl, getCurrentBlockchainNetwork} from '@/helpers/testnet'
import {useLocale} from '@/components/context/intl'
import config from '@/config'

const messages = defineMessages({
  title: 'You are on testnet network ({label}).',
  link: 'link',
  message: 'Follow this {link} to open main net.',
})

const useStyles = makeStyles((theme) => ({
  link: {
    color: 'inherit',
  },
}))

const MainnetLink = ({to}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  // Note: the color of our default link just does not look nice here
  return (
    <Link to={to} underline="always" external target="_blank" className={classes.link}>
      {tr(messages.link)}
    </Link>
  )
}

const useBlockchainInfo = () => {
  const {origin} = useUrlInfo()
  const {locale} = useLocale()

  const mainnetUrl = getMainnetUrl(locale)
  const currentBlockchainNetwork = getCurrentBlockchainNetwork(origin)
  return {mainnetUrl, currentBlockchainNetwork}
}

const _TestnetPanel = () => {
  const {formatMsg} = useI18n()

  const {mainnetUrl, currentBlockchainNetwork} = useBlockchainInfo()
  if (currentBlockchainNetwork.isMainnet) return null

  return (
    <NotificationPanel
      title={formatMsg(messages.title, {
        label: currentBlockchainNetwork.label,
      })}
      message={formatMsg(messages.message, {
        link: <MainnetLink to={mainnetUrl} />,
      })}
    />
  )
}

const TestnetPanel = () => {
  return config.enableTestnet ? <_TestnetPanel /> : null
}

export default TestnetPanel
