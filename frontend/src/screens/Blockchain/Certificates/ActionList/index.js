import React, {useMemo} from 'react'
import _ from 'lodash'
import {defineMessages} from 'react-intl'
import {Typography, Collapse} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link} from '@/components/common'
import {
  SummaryCard,
  Divider,
  DesktopOnly,
  MobileOnly,
  ExpandableCardContent,
} from '@/components/visual'
import useModalState from '@/components/hooks/useModalState'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

import {CERT_ACTIONS_TYPES} from '../actionTypes'
import {ExpandIconButton, ShowMoreButton} from './ExpandButtons'
import {
  FormattedFee,
  FormattedMargin,
  FormattedPledge,
  PoolHashLinkEllipsized,
  StakingKeyLinks,
  TxHashLink,
  TxHashLinkEllipsized,
  StakingKeyLinkEllipsized,
  HashWithCopyToClipboard,
} from './utils'
import DesktopAction from './DesktopAction'
import MobileAction from './MobileAction'

const Row = SummaryCard.Row
const Label = SummaryCard.Label
const Value = SummaryCard.Value

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
  poolDeletion__value: 'Pending rewards moved to reward pool for epoch {epoch}',

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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
  },
  expandableCardFooter: {
    border: 'none',
  },
}))

const poolExistsMessage = ({poolExists, i18n}) => {
  const {translate: tr} = i18n
  return poolExists ? tr(messages.poolExists) : tr(messages.poolNotExists)
}

const poolUpdateRelatedMessages = ({
  wasRetiringDuringUpdate,
  poolExists,
  isInRetirement,
  retirementTxHash,
  i18n,
}) => {
  const {translate: tr, formatMsg} = i18n
  return [
    wasRetiringDuringUpdate && tr(messages.poolUpdate__poolWasRetiring),
    poolExistsMessage({poolExists, i18n}),
    isInRetirement &&
      formatMsg(messages.poolUpdate__retirementAnnouncement, {
        txHash: <TxHashLinkEllipsized txHash={retirementTxHash} />,
      }),
  ]
}

const keyRegistration = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {stakingKey, previousDeregistrationTx, nextDeregistrationTx} = action
  return {
    label: tr(messages.registration__label),
    values: [
      formatMsg(messages.registration__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
      }),
      previousDeregistrationTx &&
        formatMsg(messages.registration__previousDeregistration, {
          txHash: <TxHashLinkEllipsized txHash={previousDeregistrationTx.txHash} />,
        }),
      nextDeregistrationTx &&
        formatMsg(messages.registration__nextDeregistration, {
          txHash: <TxHashLinkEllipsized txHash={nextDeregistrationTx.txHash} />,
        }),
    ],
  }
}

const keyDeregistration = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {previousRegistrationTx, nextRegistrationTx, stakingKey} = action
  return {
    label: tr(messages.deregistration__label),
    values: [
      formatMsg(messages.deregistration__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
      }),
      previousRegistrationTx &&
        formatMsg(messages.deregistration__previousRegistration, {
          txHash: <TxHashLinkEllipsized txHash={previousRegistrationTx.txHash} />,
        }),
      nextRegistrationTx &&
        formatMsg(messages.deregistration__nextRegistration, {
          txHash: <TxHashLinkEllipsized txHash={nextRegistrationTx.txHash} />,
        }),
    ],
  }
}

const keyRewardReception = ({action, i18n}) => {
  const {translate: tr, formatMsg, formatPercent} = i18n
  const {stakingKey, reward, poolHash, performance, maxReward} = action

  return {
    label: tr(messages.rewardPaid__label),
    values: [
      formatMsg(messages.rewardPaid__value, {
        amount: <AdaValue showCurrency value={reward} />,
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      formatMsg(messages.rewardPaid__poolMisperformance, {
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
        percent: formatPercent(1 - performance),
      }),
      formatMsg(messages.rewardPaid__maximumReward, {
        amount: <AdaValue showCurrency value={maxReward} />,
      }),
    ],
  }
}

const keyRegistrationAsPoolOwner = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {
    stakingKey,
    poolHash,
    wasRetiringDuringUpdate,
    poolExists,
    isInRetirement,
    retirementTxHash,
  } = action
  return {
    label: tr(messages.keyRegisteredAsPoolOwner__label),
    values: [
      formatMsg(messages.keyRegisteredAsPoolOwner__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      ...poolUpdateRelatedMessages({
        wasRetiringDuringUpdate,
        poolExists,
        isInRetirement,
        retirementTxHash,
        i18n,
      }),
    ],
  }
}

const keyDeregistrationAsPoolOwner = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {
    stakingKey,
    poolHash,
    wasRetiringDuringUpdate,
    poolExists,
    isInRetirement,
    retirementTxHash,
  } = action

  return {
    label: tr(messages.keyDeregisteredAsPoolOwner__label),
    values: [
      formatMsg(messages.keyDeregisteredAsPoolOwner__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      ...poolUpdateRelatedMessages({
        wasRetiringDuringUpdate,
        poolExists,
        isInRetirement,
        retirementTxHash,
        i18n,
      }),
    ],
  }
}

const keyRegistrationAsPoolRewardTarget = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return {
    label: tr(messages.keyRegisteredAsPoolRewardTarget__label),
    values: [
      formatMsg(messages.keyRegisteredAsPoolRewardTarget__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      prevRewardTarget &&
        formatMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget, {
          stakingKey: <StakingKeyLinkEllipsized stakingKey={prevRewardTarget} />,
        }),
      formatMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={currentRewardTarget} />,
      }),
    ],
  }
}

const keyDeregistrationAsPoolRewardTarget = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return {
    label: tr(messages.keyDeregisteredAsPoolRewardTarget__label),
    values: [
      formatMsg(messages.keyDeregisteredAsPoolRewardTarget__value, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      prevRewardTarget &&
        formatMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget, {
          stakingKey: <StakingKeyLinkEllipsized stakingKey={prevRewardTarget} />,
        }),
      formatMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget, {
        stakingKey: <StakingKeyLinkEllipsized stakingKey={currentRewardTarget} />,
      }),
    ],
  }
}

const keyDelegation = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
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
  return {
    label: tr(messages.keyDelegation__label),
    values: [
      tr(stakingKeyExists ? messages.keyExists : messages.keyNotExists),
      previousDelegatedToTxHash &&
        formatMsg(messages.keyDelegation__previouslyReplacedAtTx, {
          txHash: <TxHashLinkEllipsized txHash={txHash} />,
          stakingKey: <StakingKeyLinkEllipsized stakingKey={stakingKey} />,
          poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
        }),
      previousDelegatedToTxHash &&
        formatMsg(messages.keyDelegation__nextReplacedAtTx, {
          txHash: <TxHashLinkEllipsized txHash={nextDelegatedToTxHash} />,
        }),
      formatMsg(messages.keyDelegation__delegationBalance, {
        balance: <AdaValue showCurrency value={delegationBalance} />,
      }),

      formatMsg(messages.keyDelegation__currentDelegationBalance, {
        balance: <AdaValue showCurrency value={currentDelegationBalance} />,
      }),

      formatMsg(messages.keyDelegation__currentDelegation, {
        poolHash: <PoolHashLinkEllipsized poolHash={currentPoolHashDelegatedTo} />,
      }),
    ],
  }
}

const poolCreationMessages = defineMessages({
  name: 'Name:',
  webpageLabel: 'Webpage:',
  ownersLabel: 'Owners:',
  vrfKeyLabel: 'VRF Key:',
  hotKeyLabel: 'Hot Key:',
  coldKeyLabel: 'Cold Key:',
  feeLabel: 'Fee:',
  marginLabel: 'Margin:',
  pledgeLabel: 'Pledge:',
})

const DEFAULT_OWNERS_COUNT_SHOWN = 3
const OwnersValue = ({owners}) => {
  const {isOpen, toggle} = useModalState()
  const classes = useStyles()
  return (
    <React.Fragment>
      <ExpandableCardContent
        expanded={isOpen}
        onChange={toggle}
        renderHeader={() => <StakingKeyLinks links={owners.slice(0, DEFAULT_OWNERS_COUNT_SHOWN)} />}
        renderExpandedArea={() => (
          <StakingKeyLinks links={owners.slice(DEFAULT_OWNERS_COUNT_SHOWN)} />
        )}
        renderFooter={(expanded) => null}
        footerClasses={{root: classes.expandableCardFooter}}
      />
      {owners.length > DEFAULT_OWNERS_COUNT_SHOWN && (
        <ShowMoreButton expanded={isOpen} onClick={toggle} />
      )}
    </React.Fragment>
  )
}

const poolCreationAdditionalRows = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {stakepoolOwners, stakepool} = action
  const {name, fee, margin, pledge, webpage, vrfKey, hotKey, coldKey} = stakepool

  return [
    {
      label: tr(poolCreationMessages.name),
      value: name,
    },
    {
      label: tr(poolCreationMessages.webpageLabel),
      value: (
        <Link external bold to={webpage}>
          <Typography noWrap>{webpage}</Typography>
        </Link>
      ),
    },
    {
      label: tr(poolCreationMessages.ownersLabel),
      value: <OwnersValue owners={stakepoolOwners} />,
    },
    {
      label: tr(poolCreationMessages.vrfKeyLabel),
      value: <HashWithCopyToClipboard hash={vrfKey} />,
    },
    {
      label: tr(poolCreationMessages.hotKeyLabel),
      value: <HashWithCopyToClipboard hash={hotKey} />,
    },
    {
      label: tr(poolCreationMessages.coldKeyLabel),
      value: <HashWithCopyToClipboard hash={coldKey} />,
    },
    {
      label: tr(poolCreationMessages.feeLabel),
      value: <FormattedFee value={fee} />,
    },
    {
      label: tr(poolCreationMessages.marginLabel),
      value: <FormattedMargin value={margin} />,
    },
    {
      label: tr(poolCreationMessages.pledgeLabel),
      value: <FormattedPledge value={pledge} />,
    },
  ]
}

const poolCreation = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {poolHash} = action
  return {
    label: tr(messages.poolCreation__label),
    values: [
      formatMsg(messages.poolCreation__value, {
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
    ],
    additionalRows: poolCreationAdditionalRows({action, i18n}),
  }
}

const poolUpdateMessages = defineMessages({
  feeChange: 'Fee changed:',
  marginChange: 'Margin changed:',
  pledgeChange: 'Pledge changed:',
  prevValue: '(was {prevValue})',
  owners: 'Owners changed:',
  addedOwners: 'Added owners: {count}',
  removedOwners: 'Removed owners: {count}',
  totalOwners: 'Total owners: {count}',
})

const genericUpdatedPropValueMsg = ({i18n, value, prevValue}) => {
  const {formatMsg} = i18n
  return (
    <React.Fragment>
      {value}&nbsp;
      <Typography component="span" color="textSecondary">
        {formatMsg(poolUpdateMessages.prevValue, {prevValue})}
      </Typography>
    </React.Fragment>
  )
}

const getAddedOwners = ({prevOwners, owners}) => _.difference(owners, prevOwners)
const getRemovedOwners = ({prevOwners, owners}) => _.difference(prevOwners, owners)

const UpdatedOwners = ({prevValue, value, i18n: {translate: tr}}) => {
  const {isOpen: isAddedOwnersExpanded, toggle: toggleAddedOwners} = useModalState()
  const {isOpen: isRemovedOwnersExpanded, toggle: toggleRemovedOwners} = useModalState()
  const {isOpen: isTotalOwnersExpanded, toggle: toggleTotalOwners} = useModalState()

  const addedOwners = useMemo(
    () =>
      getAddedOwners({
        prevOwners: prevValue,
        owners: value,
      }),
    [prevValue, value]
  )
  const removedOwners = useMemo(
    () =>
      getRemovedOwners({
        prevOwners: prevValue,
        owners: value,
      }),
    [prevValue, value]
  )
  const totalOwners = value

  return (
    <React.Fragment>
      {addedOwners.length > 0 && (
        <React.Fragment>
          {tr(poolUpdateMessages.addedOwners, {
            count: addedOwners.length,
          })}
          <ExpandIconButton expanded={isAddedOwnersExpanded} onClick={toggleAddedOwners} />
          <Collapse in={isAddedOwnersExpanded}>
            <StakingKeyLinks links={addedOwners} />
          </Collapse>
        </React.Fragment>
      )}

      {removedOwners.length > 0 && (
        <React.Fragment>
          {tr(poolUpdateMessages.removedOwners, {
            count: removedOwners.length,
          })}
          <ExpandIconButton expanded={isRemovedOwnersExpanded} onClick={toggleRemovedOwners} />
          <Collapse in={isRemovedOwnersExpanded}>
            <StakingKeyLinks links={removedOwners} />
          </Collapse>
        </React.Fragment>
      )}

      {tr(poolUpdateMessages.totalOwners, {
        count: totalOwners.length,
      })}
      <ExpandIconButton expanded={isTotalOwnersExpanded} onClick={toggleTotalOwners} />
      <Collapse in={isTotalOwnersExpanded}>
        <StakingKeyLinks links={totalOwners} />
      </Collapse>
    </React.Fragment>
  )
}

const POOL_UPDATE_UPDATED_PROP_ROW = {
  FEE: ({prevValue, value, i18n, i18n: {translate: tr}}) => ({
    label: tr(poolUpdateMessages.feeChange),
    value: genericUpdatedPropValueMsg({
      i18n,
      value: <FormattedFee value={value} />,
      prevValue: <FormattedFee value={prevValue} />,
    }),
  }),
  MARGIN: ({prevValue, value, i18n, i18n: {translate: tr}}) => ({
    label: tr(poolUpdateMessages.marginChange),
    value: genericUpdatedPropValueMsg({
      i18n,
      value: <FormattedMargin value={value} />,
      prevValue: <FormattedMargin value={prevValue} />,
    }),
  }),
  PLEDGE: ({prevValue, value, i18n, i18n: {translate: tr}}) => ({
    label: tr(poolUpdateMessages.pledgeChange),
    value: genericUpdatedPropValueMsg({
      i18n,
      value: <FormattedPledge value={value} />,
      prevValue: <FormattedPledge value={prevValue} />,
    }),
  }),
  OWNERS: ({prevValue, value, i18n, i18n: {translate: tr}}) => ({
    label: tr(poolUpdateMessages.owners),
    value: <UpdatedOwners {...{prevValue, value, i18n}} />,
  }),
}

const poolUpdate = ({action, i18n}) => {
  const {
    poolHash,
    wasRetiringDuringUpdate,
    poolExists,
    isInRetirement,
    retirementTxHash,
    updatedProperties,
  } = action
  const {translate: tr, formatMsg} = i18n
  return {
    label: tr(messages.poolUpdate__label),
    values: [
      formatMsg(messages.poolUpdate__value, {
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
      }),
      ...poolUpdateRelatedMessages({
        wasRetiringDuringUpdate,
        poolExists,
        isInRetirement,
        retirementTxHash,
        i18n,
      }),
    ],
    additionalRows: updatedProperties.map(({type, prevValue, value}, index) =>
      POOL_UPDATE_UPDATED_PROP_ROW[type]({i18n, prevValue, value})
    ),
  }
}

const poolDeletion = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {rewardsEpoch} = action
  return {
    label: tr(messages.poolDeletion__label),
    values: [
      formatMsg(messages.poolDeletion__value, {
        epoch: <Link to={routeTo.epoch(rewardsEpoch)}>{rewardsEpoch}</Link>,
      }),
    ],
  }
}

const poolRetirement = ({action, i18n}) => {
  const {translate: tr, formatMsg} = i18n
  const {
    poolExists,
    retiring,
    epoch,
    poolHash,
    createdAtTxHash,
    previousUpdatedAtTxHash,
    nextUpdatedAtTxHash,
  } = action
  return {
    label: tr(messages.poolRetiring__label),
    values: [
      formatMsg(messages.poolRetirement__value, {
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
        epoch,
      }),
      poolExistsMessage({poolExists, i18n}),
      retiring && tr(messages.poolRetiring),
      formatMsg(messages.poolCreatedAtTxHash, {
        txHash: <TxHashLinkEllipsized txHash={createdAtTxHash} />,
      }),
      previousUpdatedAtTxHash &&
        formatMsg(messages.poolPreviousUpdatedAtTxHash, {
          txHash: <TxHashLinkEllipsized txHash={previousUpdatedAtTxHash} />,
        }),
      nextUpdatedAtTxHash &&
        formatMsg(messages.poolNextUpdatedAtTxHash, {
          txHash: <TxHashLinkEllipsized txHash={nextUpdatedAtTxHash} />,
        }),
    ],
  }
}

const poolRetirementCancellation = ({action, i18n}) => {
  const {poolHash, epochNumber} = action
  const {translate: tr, formatMsg} = i18n

  return {
    label: tr(messages.poolRetirementCancellation__label),
    values: [
      formatMsg(messages.poolRetirementCancellation__value, {
        poolHash: <PoolHashLinkEllipsized poolHash={poolHash} />,
        epochNumber,
      }),
    ],
  }
}

const AdditionalRowLabel = ({children}) => (
  <Label>
    <Typography variant="body1" color="textSecondary">
      {children}
    </Typography>
  </Label>
)

const depositRow = ({value, i18n}) => {
  const {translate: tr} = i18n
  return {
    label: tr(messages.deposit),
    value: <AdaValue showCurrency value={value} />,
  }
}
const refundRow = ({value, i18n}) => {
  const {translate: tr} = i18n
  return {
    label: tr(messages.refund),
    value: <AdaValue showCurrency value={value} />,
  }
}

const transactionRow = ({tx, i18n}) => {
  const {translate: tr, formatTimestamp} = i18n
  return {
    label: tr(messages.txHash),
    value: (
      <React.Fragment>
        <Typography variant="body1">
          <TxHashLink txHash={tx.txHash}>
            <TxHashLinkEllipsized txHash={tx.txHash} />
          </TxHashLink>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatTimestamp(tx.timestamp)}
        </Typography>
      </React.Fragment>
    ),
  }
}

const GET_RENDER_CONTENT = {
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION]: keyRegistration,
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION]: keyDeregistration,
  [CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT]: keyRewardReception,
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER]: keyRegistrationAsPoolOwner,
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER]: keyDeregistrationAsPoolOwner,
  [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET]: keyRegistrationAsPoolRewardTarget,
  // next line has 102 characters, for unknown reason it doesn't pretty-print correctly
  // eslint-disable-next-line max-len
  [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET]: keyDeregistrationAsPoolRewardTarget,
  [CERT_ACTIONS_TYPES.KEY_DELEGATION]: keyDelegation,
  [CERT_ACTIONS_TYPES.POOL_CREATION]: poolCreation,
  [CERT_ACTIONS_TYPES.POOL_UPDATE]: poolUpdate,
  [CERT_ACTIONS_TYPES.POOL_DELETION]: poolDeletion,
  [CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION]: poolRetirementCancellation,
  [CERT_ACTIONS_TYPES.POOL_RETIREMENT]: poolRetirement,
}

const AdditionalRows = ({rows}) => {
  return rows.map(({label, value}, index) => {
    return (
      <Row key={index}>
        <AdditionalRowLabel>{label}</AdditionalRowLabel>
        <Value>{value}</Value>
      </Row>
    )
  })
}

const ActionList = ({actions, showTxHash}) => {
  const classes = useStyles()
  const i18n = useI18n()
  return (
    <div className={classes.wrapper}>
      {actions.map((action, index) => {
        const {label, values, additionalRows} = GET_RENDER_CONTENT[action.type]({action, i18n})

        const filteredValues = values.filter(_.identity)

        const rows = [
          ...(additionalRows || []),
          action.deposit && depositRow({value: action.deposit, i18n}),
          action.refund && refundRow({value: action.refund, i18n}),
          showTxHash && transactionRow({tx: action.tx, i18n}),
        ].filter(_.identity)

        return (
          <React.Fragment key={index}>
            <Divider />
            <DesktopOnly>
              <DesktopAction {...{action, label, values: filteredValues}} />
            </DesktopOnly>
            <MobileOnly>
              <MobileAction {...{action, label, values: filteredValues}} />
            </MobileOnly>
            <AdditionalRows rows={rows} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ActionList
