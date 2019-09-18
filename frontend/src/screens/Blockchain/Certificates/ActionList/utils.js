import React from 'react'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link, CopyToClipboard, Ellipsize} from '@/components/common'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CertificateActionIcon from '../ActionIcon'

export const FormattedFee = ({value}) => <AdaValue showCurrency value={value} />

export const FormattedMargin = ({value}) => {
  const {formatPercent} = useI18n()
  return formatPercent(value)
}

export const FormattedPledge = ({value}) => <AdaValue showCurrency value={value} />

const DESKTOP_CHARS_COUNT_SHOWN = 8
const MOBILE_CHARS_COUNT_SHOWN = 6
export const EllipsizeMiddleFixed = ({value}) => {
  return (
    <Ellipsize
      value={value}
      xsCount={MOBILE_CHARS_COUNT_SHOWN}
      mdCount={DESKTOP_CHARS_COUNT_SHOWN}
    />
  )
}

const StakingKeyLink = ({stakingKey, children}) => {
  return (
    <Link monospace to={routeTo.stakingKey(stakingKey)}>
      {children}
    </Link>
  )
}

export const TxHashLinkEllipsized = ({txHash}) => {
  return (
    <Link monospace to={routeTo.transaction(txHash)}>
      <EllipsizeMiddleFixed value={txHash} />
    </Link>
  )
}

export const TxHashLink = ({txHash, children}) => {
  return (
    <Link monospace to={routeTo.transaction(txHash)}>
      {children}
    </Link>
  )
}

export const PoolHashLinkEllipsized = ({poolHash}) => {
  return (
    <Link monospace to={routeTo.stakingKey(poolHash)}>
      <EllipsizeMiddleFixed value={poolHash} />
    </Link>
  )
}

export const StakingKeyLinkEllipsized = ({stakingKey}) => {
  return (
    <Link monospace to={routeTo.stakingKey(stakingKey)}>
      <EllipsizeMiddleFixed value={stakingKey} />
    </Link>
  )
}

export const StakingKeyLinks = ({links}) => {
  return links.map((link) => (
    <div key={link}>
      <StakingKeyLink stakingKey={link}>
        <EllipsizeMiddleFixed value={link} />
      </StakingKeyLink>
    </div>
  ))
}

const useStyles = makeStyles(({spacing, typography}) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -8,
    marginBottom: -8,
  },
  monospace: typography._monospace,
}))

export const HashWithCopyToClipboard = ({hash}) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Typography className={classes.monospace}>
        <EllipsizeMiddleFixed value={hash} />
      </Typography>
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
