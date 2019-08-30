import React from 'react'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link, CopyToClipboard} from '@/components/common'
import {EllipsizeMiddle} from '@/components/visual'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CertificateActionIcon from '../ActionIcon'

export const FormattedCost = ({value}) => <AdaValue showCurrency value={value} />

export const FormattedMargin = ({value}) => {
  const {formatPercent} = useI18n()
  return formatPercent(value)
}

export const FormattedPledge = ({value}) => <AdaValue showCurrency value={value} />

export const StakingKeyLink = ({stakingKey}) => {
  return <Link to={routeTo.stakingKey(stakingKey)}>{stakingKey}</Link>
}

export const TxHashLinkEllipsized = ({txHash}) => {
  return (
    <Link to={routeTo.transaction(txHash)}>
      <EllipsizeMiddleFixed value={txHash} />
    </Link>
  )
}

export const TxHashLink = ({txHash}) => {
  return <Link to={routeTo.transaction(txHash)}>{txHash}</Link>
}

export const PoolHashLinkEllipsized = ({poolHash}) => {
  return (
    <Link to={routeTo.stakingKey(poolHash)}>
      <EllipsizeMiddleFixed value={poolHash} />
    </Link>
  )
}

export const StakingKeyLinkEllipsized = ({stakingKey}) => {
  return (
    <Link to={routeTo.stakingKey(stakingKey)}>
      <EllipsizeMiddleFixed value={stakingKey} />
    </Link>
  )
}

const DESKTOP_CHARS_COUNT_SHOWN = 16
const MOBILE_CHARS_COUNT_SHOWN = 8
export const EllipsizeMiddleFixed = ({value}) => {
  // Note(bigamasta): We're not using <MobileOnly> and <DesktopOnly>
  // because EllipsizeMiddleFixed is initially hidden in ExpansionPanel
  // (see MobileAction for details)
  const isMobile = useIsMobile()
  return (
    <EllipsizeMiddle
      value={value}
      startCharsCnt={isMobile ? MOBILE_CHARS_COUNT_SHOWN : DESKTOP_CHARS_COUNT_SHOWN}
      endCharsCnt={isMobile ? MOBILE_CHARS_COUNT_SHOWN : DESKTOP_CHARS_COUNT_SHOWN}
    />
  )
}

export const StakingKeyLinks = ({links}) => {
  return links.map((link, index) => (
    <Typography key={index} noWrap component="div">
      <StakingKeyLink stakingKey={link} />
    </Typography>
  ))
}

const useStyles = makeStyles(({spacing}) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -8,
    marginBottom: -8,
  },
}))

export const HashWithCopyToClipboard = ({hash}) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Typography noWrap>{hash}</Typography>
      <CopyToClipboard value={hash} />
    </div>
  )
}

const useIconLabelStyles = makeStyles((theme) => ({
  contentLeftSpacing: {
    paddingLeft: theme.spacing(1),
  },
}))

export const CertIconWithLabel = ({certType, children}) => {
  const classes = useIconLabelStyles()
  return (
    <React.Fragment>
      <CertificateActionIcon type={certType} />
      <Typography
        color="textPrimary"
        component="span"
        className={certType && classes.contentLeftSpacing}
      >
        {children}
      </Typography>
    </React.Fragment>
  )
}
