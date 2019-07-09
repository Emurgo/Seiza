import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link} from '@/components/common'
import {SummaryCard, Divider} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CertificateIcon from './CertificateIcon'
import {CERT_TYPES} from './helpers'

const messages = defineMessages({
  keyRegistered: 'Key registered',
  keyDeregistered: 'Key de-registered',
  poolRetiring: 'Pool retiring',
  deposit: 'Deposit:',
  txHash: 'Transaction: ',
  registration: '{stakingKey} is registered.',
  deregistration: '{stakingKey} is deregistered',
  deregistration2: 'and is not longer active.',
  poolRetiringDescription: '{stakingKey} cancelled its retirement (was planned for epoch {epoch})',
})

const useStyles = makeStyles(({spacing}) => ({
  wrapper: {
    width: '100%',
  },
  icon: {
    verticalAlign: 'bottom',
  },
  contentLeftSpacing: {
    paddingLeft: spacing(1),
  },
}))

const Row = SummaryCard.Row
const Label = SummaryCard.Label
const Value = SummaryCard.Value

const IconLabel = ({icon, children}) => {
  const classes = useStyles()
  return (
    <Label>
      {icon}
      <Typography
        color="textPrimary"
        component="span"
        className={icon && classes.contentLeftSpacing}
      >
        {children}
      </Typography>
    </Label>
  )
}

const KeyRegistered = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <Row>
      <IconLabel icon={<CertificateIcon type={CERT_TYPES.KEY_REGISTERED} />}>
        {tr(messages.keyRegistered)}
      </IconLabel>
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
  )
}
const KeyDeregistered = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <Row>
      <IconLabel icon={<CertificateIcon type={CERT_TYPES.KEY_DEREGISTERED} />}>
        {tr(messages.keyDeregistered)}
      </IconLabel>
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
  )
}

const PoolRetiring = ({certificate}) => {
  const {translate: tr} = useI18n()
  return (
    <Row>
      <IconLabel icon={<CertificateIcon type={CERT_TYPES.POOL_RETIRING} />}>
        {tr(messages.poolRetiring)}
      </IconLabel>
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

const DepositRow = ({deposit}) => {
  const {translate: tr} = useI18n()
  return (
    <Row hideSeparator>
      {tr(messages.deposit)}
      <Value>
        <AdaValue showCurrency value={deposit} />
      </Value>
    </Row>
  )
}

const TransactionRow = ({tx}) => {
  const {translate: tr, formatTimestamp} = useI18n()
  return (
    <Row hideSeparator>
      {tr(messages.txHash)}
      <Value>
        <Typography variant="body1" align="right">
          <Link monospace to={routeTo.transaction(tx.txHash)}>
            {tx.txHash}
          </Link>
        </Typography>
        <Typography variant="caption" color="textSecondary" align="right">
          {formatTimestamp(tx.timestamp)}
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

const CertificateList = ({certificates, showTxHash}) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      {certificates.map((certificate, index) => {
        const Certificate = CERT_TYPE_TO_COMPONENT[certificate.type]
        return (
          <React.Fragment key={index}>
            <Divider />
            <Certificate certificate={certificate} />
            {certificate.deposit && <DepositRow deposit={certificate.deposit} />}
            {showTxHash && <TransactionRow tx={certificate.tx} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default CertificateList
