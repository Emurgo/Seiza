// @flow

import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {useUserAgent} from '@/components/context/userAgent'

const messages = defineMessages({
  unsupportedBrowser: 'You are using an unsupported browser.',
})

const useStyles = makeStyles((theme) => ({
  banner: {
    // Note:(ppershing): we really want to reverse color&background
    background: theme.palette.alertStrong.color,
    color: theme.palette.alertStrong.background,
    textAlign: 'center',
    paddingBottom: theme.spacing(0.5),
  },
  icon: {
    fontSize: '25px',
    fontWeight: 700,
    paddingRight: theme.spacing(1),
  },
}))

const UnsupportedBrowserBanner = () => {
  const {translate} = useI18n()
  const classes = useStyles()

  return (
    <div className={classes.banner}>
      <Typography>
        <span className={classes.icon}>⚠</span>
        {translate(messages.unsupportedBrowser)}
      </Typography>
    </div>
  )
}

const UnsupportedBrowserBannerWrapper = () => {
  const {isCrawler, isSupportedBrowser} = useUserAgent()

  if (isCrawler || isSupportedBrowser) return null

  return <UnsupportedBrowserBanner />
}

export default UnsupportedBrowserBannerWrapper
