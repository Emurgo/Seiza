import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link} from '@/components/common'
import {SummaryCard, Divider} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CertificateActionIcon from './ActionIcon'
import {CERT_ACTIONS_TYPES} from './actionTypes'

// TODO: still or again
const messages = defineMessages({
  registration__label: 'Key registered',
  registration__value: '{stakingKey} is registered.',
  registration__previousDeregistration: 'It was previously deregistered at {txHash}.',
  registration__nextDeregistration: 'This key was later deregistered at {txHash}.',

  // epochs or something else? It lacks in Ruslan's doc
  deregistration__label: 'Key de-registered',
  deregistration__value: '{stakingKey} is deregistered.',
  deregistration__previousActiveStatusLength: 'The key was active for {count} epochs.',
  deregistration__previousRegistration: 'The key was previously registered at {txHash}.',
  deregistration__nextRegistration: 'The key was later registered at {txHash}.',

  poolCreation__label: 'Pool created',
  poolCreation__value: 'Pool {poolHash} created.',

  poolUpdate__label: 'Pool updated',
  poolUpdate__value: 'Pool {poolHash} updated.',
  poolUpdate__poolWasRetiring: 'Pool was retiring before this action.',
  poolUpdate__retirementAnnouncement: 'Pool announced retirement at {txHash}.',

  poolDeletion__label: 'Pool deleted',
  poolDeletion__value: '<TODO: Eveything we knew about the pool>',

  keyDelegation__label: 'Key delegating',
  keyDelegation__value: 'Key {stakingKey} started delegating to {poolHash} at {txHash}.',
  keyDelegation__currentDelegation: 'This key now delegates to {poolHash}.',
  keyDelegation__previouslyReplacedAtTx: 'This delegation got previously replaced at {txHash}.',
  keyDelegation__nextReplacedAtTx: 'This delegation got later replaced at {txHash}.',
  keyDelegation__currentDelegationBalance: 'Current Delegation Balance: {balance}.',
  keyDelegation__delegationBalance: 'Delegation Balance: {balance}.',

  rewardPaid__label: 'Key reward received',
  rewardPaid__value: 'Reward {amount} is paid to {stakingKey} from {poolHash}.',
  rewardPaid__poolMisperformance: 'Pool {poolHash} is {percent} away from ideal performance.',
  rewardPaid__maximumReward: 'If pool performs ideally, key would have received {amount}.',

  keyRegisteredAsPoolRewardTarget__previousRewardTarget: 'Previous Reward target: {stakingKey}.',
  keyRegisteredAsPoolRewardTarget__currentRewardTarget: 'Current Reward target: {stakingKey}.',

  keyRegisteredAsPoolOwner__label: 'Key registered as Pool Owner',
  keyRegisteredAsPoolOwner__value: 'Key {stakingKey} registered as Pool Owner of pool {poolHash}.',

  keyDeregisteredAsPoolOwner__label: 'Key deregistered as Pool Owner',
  keyDeregisteredAsPoolOwner__value: 'Key {stakingKey} deregistered as Pool Owner of {poolHash}.',

  keyRegisteredAsPoolRewardTarget__label: 'Key registered as Pool Reward Target',
  keyRegisteredAsPoolRewardTarget__value:
    "Key {stakingKey} registered as {poolHash}'s pool reward target.",

  keyDeregisteredAsPoolRewardTarget__label: 'Key deregistered as Pool Reward Target',
  keyDeregisteredAsPoolRewardTarget__value:
    "Key {stakingKey} deregistered as {poolHash}'s pool reward target.",

  previousRewardTarget: 'Previous target for this pool was {stakingKey}',
  currentRewardTarget: 'Current target for this pool is {stakingKey}',

  poolRetiring__label: 'Pool retiring',
  poolRetirement__value: "Pool {poolHash} announced its' retirement (planned for epoch {epoch})",

  poolRetirementCancellation__label: 'Pool retirement cancelled',
  poolRetirementCancellation__value:
    'Pool {poolHash} cancelled its retirement (was planned for epoch {epochNumber})',

  keyExists: 'Key exists to this day.',
  keyNotExists: "Key currently doesn't exist.",
  poolPreviousUpdatedAt: 'Pool was previously updated at {timestamp}.',
  poolNextUpdatedAt: 'Pool was later updated at {timestamp}.',
  poolCreatedAt: 'Pool was created at {timestamp}.',
  poolPreviousUpdatedAtTxHash: 'Pool was previously updated at {txHash}.',
  poolNextUpdatedAtTxHash: 'Pool was later updated at {txHash}.',
  poolCreatedAtTxHash: 'Pool was created at {txHash}.',
  poolExists: 'Pool exists to this day.',
  poolNotExists: "Pool currently doesn't exist.",
  poolRetiring: 'Pool is currently retiring.',
  deposit: 'Deposit:',
  txHash: 'Transaction: ',
  refund: 'Refund:',
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

const IconLabel = ({certType, children}) => {
  const classes = useStyles()
  return (
    <Label>
      <CertificateActionIcon type={certType} />
      <Typography
        color="textPrimary"
        component="span"
        className={certType && classes.contentLeftSpacing}
      >
        {children}
      </Typography>
    </Label>
  )
}

const fmtdMsg = (id, values) => {
  return (
    <FormattedMessage
      // $FlowFixMe
      id={id}
      values={values}
    />
  )
}

const TxHashLink = ({txHash}) => {
  return <Link to={routeTo.transaction(txHash)}>{txHash}</Link>
}
const PoolHashLink = ({poolHash}) => {
  return <Link to={routeTo.stakingKey(poolHash)}>{poolHash}</Link>
}
const StakingKeyLink = ({stakingKey}) => {
  return <Link to={routeTo.stakingKey(stakingKey)}>{stakingKey}</Link>
}

const PoolUpdateRelatedMessages = ({
  wasRetiringDuringUpdate,
  poolExists,
  isInRetirement,
  retirementTxHash,
}) => {
  const {translate: tr} = useI18n()
  return (
    <React.Fragment>
      {wasRetiringDuringUpdate && (
        <React.Fragment>{tr(messages.poolUpdate__poolWasRetiring)} </React.Fragment>
      )}

      <PoolCurrentlyExistsMessage poolExists={poolExists} />

      {isInRetirement && (
        <React.Fragment>
          {' '}
          {fmtdMsg(messages.poolUpdate__retirementAnnouncement.id, {
            txHash: <TxHashLink txHash={retirementTxHash} />,
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const KeyRegistration = ({action}) => {
  const {translate: tr} = useI18n()
  const {stakingKey, previousDeregistrationTx, nextDeregistrationTx} = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.registration__label)}</IconLabel>
      <Value>
        <Typography variant="body1" color="textSecondary">
          {fmtdMsg(messages.registration__value.id, {
            stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          })}{' '}
          {previousDeregistrationTx && (
            <React.Fragment>
              {fmtdMsg(messages.registration__previousDeregistration.id, {
                txHash: <TxHashLink txHash={previousDeregistrationTx.txHash} />,
              })}{' '}
            </React.Fragment>
          )}
          {nextDeregistrationTx &&
            fmtdMsg(messages.registration__nextDeregistration.id, {
              txHash: <TxHashLink txHash={nextDeregistrationTx.txHash} />,
            })}
        </Typography>
      </Value>
    </Row>
  )
}

const KeyDeregistration = ({action}) => {
  const {translate: tr} = useI18n()
  const {previousRegistrationTx, nextRegistrationTx, stakingKey} = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.deregistration__label)}</IconLabel>
      <Value>
        <Typography variant="body1" color="textSecondary">
          {fmtdMsg(messages.deregistration__value.id, {
            stakingKey: <Link to={routeTo.stakingKey(stakingKey)}>{stakingKey}</Link>,
          })}
        </Typography>
        {previousRegistrationTx && (
          <React.Fragment>
            {fmtdMsg(messages.deregistration__previousRegistration.id, {
              txHash: <TxHashLink txHash={previousRegistrationTx.txHash} />,
            })}{' '}
          </React.Fragment>
        )}
        {nextRegistrationTx &&
          fmtdMsg(messages.deregistration__nextRegistration.id, {
            txHash: <TxHashLink txHash={nextRegistrationTx.txHash} />,
          })}
      </Value>
    </Row>
  )
}

const KeyRewardReception = ({action}) => {
  const {translate: tr, formatPercent} = useI18n()
  const {stakingKey, reward, poolHash, performance, maxReward} = action

  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.rewardPaid__label)}</IconLabel>
      <Value>
        {fmtdMsg(messages.rewardPaid__value.id, {
          amount: <AdaValue showCurrency value={reward} />,
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        })}{' '}
        {fmtdMsg(messages.rewardPaid__poolMisperformance.id, {
          poolHash: <PoolHashLink poolHash={poolHash} />,
          percent: formatPercent(1 - performance),
        })}{' '}
        {fmtdMsg(messages.rewardPaid__maximumReward.id, {
          amount: <AdaValue showCurrency value={maxReward} />,
        })}
      </Value>
    </Row>
  )
}
const KeyRegistrationAsPoolOwner = ({action}) => {
  const {translate: tr} = useI18n()
  const {
    stakingKey,
    poolHash,
    wasRetiringDuringUpdate,
    poolExists,
    isInRetirement,
    retirementTxHash,
  } = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.keyRegisteredAsPoolOwner__label)}</IconLabel>
      <Value>
        {fmtdMsg(messages.keyRegisteredAsPoolOwner__value.id, {
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        })}
        <PoolUpdateRelatedMessages
          {...{wasRetiringDuringUpdate, poolExists, isInRetirement, retirementTxHash}}
        />
      </Value>
    </Row>
  )
}
const KeyDeregistrationAsPoolOwner = ({action}) => {
  const {translate: tr} = useI18n()
  const {
    stakingKey,
    poolHash,
    wasRetiringDuringUpdate,
    poolExists,
    isInRetirement,
    retirementTxHash,
  } = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.keyDeregisteredAsPoolOwner__label)}</IconLabel>
      <Value>
        {fmtdMsg(messages.keyDeregisteredAsPoolOwner__value.id, {
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        })}{' '}
        <PoolUpdateRelatedMessages
          {...{wasRetiringDuringUpdate, poolExists, isInRetirement, retirementTxHash}}
        />
      </Value>
    </Row>
  )
}
const KeyRegistrationAsPoolRewardTarget = ({action}) => {
  const {translate: tr} = useI18n()
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return (
    <Row>
      <IconLabel certType={action.type}>
        {tr(messages.keyRegisteredAsPoolRewardTarget__label)}
      </IconLabel>
      <Value>
        {fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__value.id, {
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        })}{' '}
        {prevRewardTarget && (
          <React.Fragment>
            {fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget.id, {
              stakingKey: <StakingKeyLink stakingKey={prevRewardTarget} />,
            })}{' '}
          </React.Fragment>
        )}
        {fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget.id, {
          stakingKey: <StakingKeyLink stakingKey={currentRewardTarget} />,
        })}
      </Value>
    </Row>
  )
}
const KeyDeregistrationAsPoolRewardTarget = ({action}) => {
  const {translate: tr} = useI18n()
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return (
    <Row>
      <IconLabel certType={action.type}>
        {tr(messages.keyDeregisteredAsPoolRewardTarget__label)}
      </IconLabel>
      <Value>
        {fmtdMsg(messages.keyDeregisteredAsPoolRewardTarget__value.id, {
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        })}{' '}
        {prevRewardTarget && (
          <React.Fragment>
            {fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget.id, {
              stakingKey: <StakingKeyLink stakingKey={prevRewardTarget} />,
            })}{' '}
          </React.Fragment>
        )}
        {fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget.id, {
          stakingKey: <StakingKeyLink stakingKey={currentRewardTarget} />,
        })}
      </Value>
    </Row>
  )
}

const KeyDelegation = ({action}) => {
  const {translate: tr} = useI18n()
  const {
    stakingKey,
    stakingKeyExists,
    poolHash,
    txHash,
    previousDelegatedToTxHash,
    nextDelegatedToTxHash,
    delegationBalance,
    currentDelegationBalance,
    currentPoolHashDelegatedTo,
  } = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.keyDelegation__label)}</IconLabel>
      <Value>
        {tr(stakingKeyExists ? messages.keyExists : messages.keyNotExists)}{' '}
        {previousDelegatedToTxHash && (
          <React.Fragment>
            {fmtdMsg(messages.keyDelegation__previouslyReplacedAtTx.id, {
              txHash: <TxHashLink txHash={txHash} />,
              stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
              poolHash: <PoolHashLink poolHash={poolHash} />,
            })}{' '}
          </React.Fragment>
        )}
        {previousDelegatedToTxHash && (
          <React.Fragment>
            {fmtdMsg(messages.keyDelegation__nextReplacedAtTx.id, {
              txHash: <TxHashLink txHash={nextDelegatedToTxHash} />,
            })}{' '}
          </React.Fragment>
        )}
        {fmtdMsg(messages.keyDelegation__delegationBalance.id, {
          balance: <AdaValue showCurrency value={delegationBalance} />,
        })}{' '}
        {fmtdMsg(messages.keyDelegation__currentDelegationBalance.id, {
          balance: <AdaValue showCurrency value={currentDelegationBalance} />,
        })}{' '}
        {fmtdMsg(messages.keyDelegation__currentDelegation.id, {
          poolHash: <PoolHashLink poolHash={currentPoolHashDelegatedTo} />,
        })}
      </Value>
    </Row>
  )
}

const PoolCurrentlyExistsMessage = ({poolExists}) => {
  const {translate: tr} = useI18n()
  return poolExists ? tr(messages.poolExists) : tr(messages.poolNotExists)
}

const PoolCreation = ({action}) => {
  const {translate: tr} = useI18n()
  const {poolHash} = action
  return (
    <React.Fragment>
      <Row>
        <IconLabel certType={action.type}>{tr(messages.poolCreation__label)}</IconLabel>
        <Value>
          {fmtdMsg(messages.poolCreation__value.id, {
            poolHash: <PoolHashLink poolHash={poolHash} />,
          })}
        </Value>
      </Row>
      <Row>
        <Label>Info about the pool</Label>
        <Value>TBD</Value>
      </Row>
    </React.Fragment>
  )
}
const PoolUpdate = ({action}) => {
  const {poolHash, wasRetiringDuringUpdate, poolExists, isInRetirement, retirementTxHash} = action
  const {translate: tr} = useI18n()
  return (
    <React.Fragment>
      <Row>
        <IconLabel certType={action.type}>{tr(messages.poolUpdate__label)}</IconLabel>
        <Value>
          {fmtdMsg(messages.poolUpdate__value.id, {
            poolHash: <PoolHashLink poolHash={poolHash} />,
          })}{' '}
          <PoolUpdateRelatedMessages
            {...{wasRetiringDuringUpdate, poolExists, isInRetirement, retirementTxHash}}
          />
        </Value>
      </Row>
      <Row>
        <Label>Info about the pool</Label>
        <Value>TBD</Value>
      </Row>
    </React.Fragment>
  )
}

const PoolDeletion = ({action}) => {
  const {translate: tr} = useI18n()
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.poolDeletion__label)}</IconLabel>
      <Value>{tr(messages.poolDeletion__value)}</Value>
    </Row>
  )
}

const PoolRetirement = ({action}) => {
  const {translate: tr} = useI18n()
  const {
    poolExists,
    retiring,
    epoch,
    poolHash,
    createdAtTxHash,
    previousUpdatedAtTxHash,
    nextUpdatedAtTxHash,
  } = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.poolRetiring__label)}</IconLabel>
      <Value>
        <Typography variant="body1" color="textSecondary">
          {fmtdMsg(messages.poolRetirement__value.id, {
            poolHash: <PoolHashLink poolHash={poolHash} />,
            epoch: (
              <Typography color="textPrimary" component="span">
                {epoch}
              </Typography>
            ),
          })}{' '}
          <PoolCurrentlyExistsMessage poolExists={poolExists} />{' '}
          {retiring && <React.Fragment>{tr(messages.poolRetiring)} </React.Fragment>}
          {fmtdMsg(messages.poolCreatedAtTxHash.id, {
            txHash: <TxHashLink txHash={createdAtTxHash} />,
          })}{' '}
          {previousUpdatedAtTxHash && (
            <React.Fragment>
              {fmtdMsg(messages.poolPreviousUpdatedAtTxHash.id, {
                txHash: <TxHashLink txHash={previousUpdatedAtTxHash} />,
              })}{' '}
            </React.Fragment>
          )}
          {nextUpdatedAtTxHash && (
            <React.Fragment>
              {fmtdMsg(messages.poolNextUpdatedAtTxHash.id, {
                txHash: <TxHashLink txHash={nextUpdatedAtTxHash} />,
              })}{' '}
            </React.Fragment>
          )}
        </Typography>
      </Value>
    </Row>
  )
}

const PoolRetirementCancellation = ({action}) => {
  const {translate: tr} = useI18n()
  const {poolHash, epochNumber} = action
  return (
    <Row>
      <IconLabel certType={action.type}>{tr(messages.poolRetirementCancellation__label)}</IconLabel>
      <Value>
        {fmtdMsg(messages.poolRetirementCancellation__value.id, {
          poolHash: <PoolHashLink poolHash={poolHash} />,
          epochNumber,
        })}{' '}
      </Value>
    </Row>
  )
}

const DepositRow = ({value}) => {
  const {translate: tr} = useI18n()
  return (
    <Row hideSeparator>
      {tr(messages.deposit)}
      <Value>
        <AdaValue showCurrency value={value} />
      </Value>
    </Row>
  )
}

const RefundRow = ({value}) => {
  const {translate: tr} = useI18n()
  return (
    <Row hideSeparator>
      {tr(messages.refund)}
      <Value>
        <AdaValue showCurrency value={value} />
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
          <TxHashLink txHash={tx.txHash} />
        </Typography>
        <Typography variant="caption" color="textSecondary" align="right">
          {formatTimestamp(tx.timestamp)}
        </Typography>
      </Value>
    </Row>
  )
}

const CERT_TYPE_TO_COMPONENT = {
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION]: KeyRegistration,
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION]: KeyDeregistration,
  [CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT]: KeyRewardReception,
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER]: KeyRegistrationAsPoolOwner,
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER]: KeyDeregistrationAsPoolOwner,
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET]: KeyRegistrationAsPoolRewardTarget,
  // next line has 102 characters, for unknown reason it doesn't pretty-print correctly
  // eslint-disable-next-line max-len
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET]: KeyDeregistrationAsPoolRewardTarget,
  [CERT_ACTIONS_TYPES.KEY_DELEGATION]: KeyDelegation,
  [CERT_ACTIONS_TYPES.POOL_CREATION]: PoolCreation,
  [CERT_ACTIONS_TYPES.POOL_UPDATE]: PoolUpdate,
  [CERT_ACTIONS_TYPES.POOL_DELETION]: PoolDeletion,
  [CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION]: PoolRetirementCancellation,
  [CERT_ACTIONS_TYPES.POOL_RETIREMENT]: PoolRetirement,
}

const ActionList = ({actions, showTxHash}) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      {actions.map((action, index) => {
        const Action = CERT_TYPE_TO_COMPONENT[action.type]
        return (
          <React.Fragment key={index}>
            <Divider />
            <Action action={action} />
            {action.deposit && <DepositRow value={action.deposit} />}
            {action.refund && <RefundRow value={action.refund} />}
            {showTxHash && <TransactionRow tx={action.tx} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ActionList
