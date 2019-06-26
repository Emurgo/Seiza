import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {SummaryCard, AdaValue, Link} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import keyDeregisteredIcon from '@/static/assets/icons/action-key-deregistered.svg'
import keyRegisteredIcon from '@/static/assets/icons/action-key-registered.svg'
import poolRetiringIcon from '@/static/assets/icons/action-pool-retiring.svg'
import CERT_TYPES from './certificateTypes'

const messages = defineMessages({
  keyRegistered: 'Key registered:',
  keyDeregistered: 'Key de-registered:',
  poolRetiring: 'Pool retiring:',
  deposit: 'Deposit:',
  registration: '{stakingKey} is registered.',
  deregistration: '{stakingKey} is deregistered',
  deregistration2: 'and is not longer active.',
  poolRetiringDescription: '{stakingKey} cancelled its retirement (was planned for epoch {epoch})',
})

const useStyles = makeStyles(({spacing}) => ({
  icon: {
    verticalAlign: 'bottom',
  },
  contentLeftSpacing: {
    paddingLeft: spacing(3),
  },
}))

const Row = SummaryCard.Row
const Label = SummaryCard.Label
const Value = SummaryCard.Value

const ICON_SIZE = 24 // in sync with actual size of svgs
const useEmptyIconPlaceholderStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
}))
const EmptyIconPlaceholder = () => {
  const className = useEmptyIconPlaceholderStyles().root
  return <span className={className} />
}

const IconLabel = ({iconSrc, children}) => {
  const classes = useStyles()
  return (
    <Label>
      {iconSrc ? <img alt="" src={iconSrc} className={classes.icon} /> : <EmptyIconPlaceholder />}
      <span className={classes.contentLeftSpacing}>{children}</span>
    </Label>
  )
}

const KeyRegistered = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <React.Fragment>
      <Row>
        <IconLabel iconSrc={keyRegisteredIcon}>{tr(messages.keyRegistered)}</IconLabel>
        <Value>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              // $FlowFixMe
              id={messages.registration.id}
              values={{
                stakingKey: (
                  <Link to={routeTo.stakingKey.home(certificate.stakingKey)}>
                    {certificate.stakingKey}
                  </Link>
                ),
                deregisteredStakingKey: (
                  <Link to={routeTo.stakingKey.home(certificate.deregisteredStakingKey)}>
                    {certificate.deregisteredStakingKey}
                  </Link>
                ),
              }}
            />{' '}
          </Typography>
        </Value>
      </Row>
      <Row>
        <IconLabel>{tr(messages.deposit)}</IconLabel>
        <Value>
          <AdaValue showCurrency value={certificate.deposit} />
        </Value>
      </Row>
    </React.Fragment>
  )
}
const KeyDeregistered = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <React.Fragment>
      <Row>
        <IconLabel iconSrc={keyDeregisteredIcon}>{tr(messages.keyDeregistered)}</IconLabel>
        <Value>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              // $FlowFixMe
              id={messages.deregistration.id}
              values={{
                stakingKey: (
                  <Link to={routeTo.stakingKey.home(certificate.stakingKey)}>
                    {certificate.stakingKey}
                  </Link>
                ),
              }}
            />
          </Typography>

          {tr(messages.deregistration2)}
        </Value>
      </Row>
      <Row>
        <IconLabel>{tr(messages.deposit)}</IconLabel>
        <Value>
          <AdaValue showCurrency value={certificate.deposit} />
        </Value>
      </Row>
    </React.Fragment>
  )
}

const PoolRetiring = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <Row>
      <IconLabel iconSrc={poolRetiringIcon}>{tr(messages.poolRetiring)}</IconLabel>
      <Value>
        <Typography variant="body1" color="textSecondary">
          <FormattedMessage
            // $FlowFixMe
            id={messages.poolRetiringDescription.id}
            values={{
              stakingKey: (
                <Link to={routeTo.stakingKey.home(certificate.stakingKey)}>
                  {certificate.stakingKey}
                </Link>
              ),
              epoch: (
                <Typography color="textPrimary" component="span">
                  {certificate.epoch}
                </Typography>
              ),
            }}
          />
        </Typography>
      </Value>
    </Row>
  )
}

const CERT_TYPE_TO_COMPONENT = {
  [CERT_TYPES.KEY_REGISTERED]: KeyRegistered,
  [CERT_TYPES.KEY_DEREGISTERED]: KeyDeregistered,
  [CERT_TYPES.POOL_RETIRING]: PoolRetiring,
}

const CertificateList = ({certificates}) => {
  return (
    <div>
      {certificates.map((certificate, index) => {
        const Certificate = CERT_TYPE_TO_COMPONENT[certificate.type]
        return <Certificate key={index} certificate={certificate} />
      })}
    </div>
  )
}

export default CertificateList
