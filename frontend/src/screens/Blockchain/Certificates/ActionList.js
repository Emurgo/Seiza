import React from 'react'
import cn from 'classnames'
import {defineMessages, FormattedMessage} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {AdaValue, Link} from '@/components/common'
import {
  SummaryCard,
  Divider,
  ExpansionPanel,
  DesktopOnly,
  MobileOnly,
  ExternalLink,
} from '@/components/visual'
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
  poolUpdate__marginChanged: 'Margin changed ({value})',
  poolUpdate__costChanged: 'Cost changed ({value})',
  poolUpdate__pledgeChanged: 'Pledge changed ({value})',

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
  expansionPanel: {
    '&:hover': {
      boxShadow: 'none',
      border: '0',
    },
    'boxShadow': 'none',
    'border': '0',
  },
  expansionPanelDetails: {
    marginTop: theme.getContentSpacing(0.5),
    marginBottom: theme.getContentSpacing(0.5),
  },
  horizontalSpacings: {
    marginLeft: theme.getContentSpacing(0.5),
    marginRight: theme.getContentSpacing(0.5),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.getContentSpacing(),
      marginRight: theme.getContentSpacing(),
    },
  },
  wrapper: {
    width: '100%',
  },
  icon: {
    verticalAlign: 'bottom',
  },
  contentLeftSpacing: {
    paddingLeft: theme.spacing(1),
  },
}))

const Row = SummaryCard.Row
const Label = SummaryCard.Label
const Value = SummaryCard.Value

const IconLabel = ({certType, children}) => {
  const classes = useStyles()
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

const MobileAction = ({action, label, value}) => {
  const classes = useStyles()
  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      summary={<IconLabel certType={action.type}>{label}</IconLabel>}
    >
      <div className={cn(classes.expansionPanelDetails, classes.horizontalSpacings)}>
        <ul>
          {value.map((val, index) => (
            <li key={index}>{val}</li>
          ))}
        </ul>
      </div>
      <Divider className={classes.horizontalSpacings} light />
    </ExpansionPanel>
  )
}

const DesktopAction = ({action, label, value}) => {
  return (
    <Row>
      <Label>
        <IconLabel certType={action.type}>{label}</IconLabel>
      </Label>
      <Value>
        {value
          .filter((x) => !!x)
          .map((val, index) => (
            <React.Fragment key={index}>{val} </React.Fragment>
          ))}
      </Value>
    </Row>
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
  const {translate: tr} = i18n
  return [
    wasRetiringDuringUpdate && tr(messages.poolUpdate__poolWasRetiring),
    poolExistsMessage({poolExists, i18n}),
    isInRetirement &&
      fmtdMsg(messages.poolUpdate__retirementAnnouncement.id, {
        txHash: <TxHashLink txHash={retirementTxHash} />,
      }),
  ]
}

const keyRegistration = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {stakingKey, previousDeregistrationTx, nextDeregistrationTx} = action
  return {
    label: tr(messages.registration__label),
    value: [
      fmtdMsg(messages.registration__value.id, {
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
      }),
      previousDeregistrationTx &&
        fmtdMsg(messages.registration__previousDeregistration.id, {
          txHash: <TxHashLink txHash={previousDeregistrationTx.txHash} />,
        }),
      nextDeregistrationTx &&
        fmtdMsg(messages.registration__nextDeregistration.id, {
          txHash: <TxHashLink txHash={nextDeregistrationTx.txHash} />,
        }),
    ],
  }
}

const keyDeregistration = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {previousRegistrationTx, nextRegistrationTx, stakingKey} = action
  return {
    label: tr(messages.deregistration__label),
    value: [
      fmtdMsg(messages.deregistration__value.id, {
        stakingKey: <Link to={routeTo.stakingKey(stakingKey)}>{stakingKey}</Link>,
      }),
      previousRegistrationTx &&
        fmtdMsg(messages.deregistration__previousRegistration.id, {
          txHash: <TxHashLink txHash={previousRegistrationTx.txHash} />,
        }),
      nextRegistrationTx &&
        fmtdMsg(messages.deregistration__nextRegistration.id, {
          txHash: <TxHashLink txHash={nextRegistrationTx.txHash} />,
        }),
    ],
  }
}

const keyRewardReception = ({action, i18n}) => {
  const {translate: tr, formatPercent} = i18n
  const {stakingKey, reward, poolHash, performance, maxReward} = action

  return {
    label: tr(messages.rewardPaid__label),
    value: [
      fmtdMsg(messages.rewardPaid__value.id, {
        amount: <AdaValue showCurrency value={reward} />,
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
        poolHash: <PoolHashLink poolHash={poolHash} />,
      }),
      fmtdMsg(messages.rewardPaid__poolMisperformance.id, {
        poolHash: <PoolHashLink poolHash={poolHash} />,
        percent: formatPercent(1 - performance),
      }),
      fmtdMsg(messages.rewardPaid__maximumReward.id, {
        amount: <AdaValue showCurrency value={maxReward} />,
      }),
    ],
  }
}

const keyRegistrationAsPoolOwner = ({action, i18n}) => {
  const {translate: tr} = i18n
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
    value: [
      fmtdMsg(messages.keyRegisteredAsPoolOwner__value.id, {
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
        poolHash: <PoolHashLink poolHash={poolHash} />,
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
  const {translate: tr} = i18n
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
    value: [
      fmtdMsg(messages.keyDeregisteredAsPoolOwner__value.id, {
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
        poolHash: <PoolHashLink poolHash={poolHash} />,
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
  const {translate: tr} = i18n
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return {
    label: tr(messages.keyRegisteredAsPoolRewardTarget__label),
    value: [
      fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__value.id, {
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
        poolHash: <PoolHashLink poolHash={poolHash} />,
      }),
      prevRewardTarget &&
        fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget.id, {
          stakingKey: <StakingKeyLink stakingKey={prevRewardTarget} />,
        }),
      fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget.id, {
        stakingKey: <StakingKeyLink stakingKey={currentRewardTarget} />,
      }),
    ],
  }
}

const keyDeregistrationAsPoolRewardTarget = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {stakingKey, poolHash, prevRewardTarget, currentRewardTarget} = action
  return {
    label: tr(messages.keyDeregisteredAsPoolRewardTarget__label),
    value: [
      fmtdMsg(messages.keyDeregisteredAsPoolRewardTarget__value.id, {
        stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
        poolHash: <PoolHashLink poolHash={poolHash} />,
      }),
      prevRewardTarget &&
        fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__previousRewardTarget.id, {
          stakingKey: <StakingKeyLink stakingKey={prevRewardTarget} />,
        }),
      fmtdMsg(messages.keyRegisteredAsPoolRewardTarget__currentRewardTarget.id, {
        stakingKey: <StakingKeyLink stakingKey={currentRewardTarget} />,
      }),
    ],
  }
}

const keyDelegation = ({action, i18n}) => {
  const {translate: tr} = i18n
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
    value: [
      tr(stakingKeyExists ? messages.keyExists : messages.keyNotExists),
      previousDelegatedToTxHash &&
        fmtdMsg(messages.keyDelegation__previouslyReplacedAtTx.id, {
          txHash: <TxHashLink txHash={txHash} />,
          stakingKey: <StakingKeyLink stakingKey={stakingKey} />,
          poolHash: <PoolHashLink poolHash={poolHash} />,
        }),
      previousDelegatedToTxHash &&
        fmtdMsg(messages.keyDelegation__nextReplacedAtTx.id, {
          txHash: <TxHashLink txHash={nextDelegatedToTxHash} />,
        }),
      fmtdMsg(messages.keyDelegation__delegationBalance.id, {
        balance: <AdaValue showCurrency value={delegationBalance} />,
      }),

      fmtdMsg(messages.keyDelegation__currentDelegationBalance.id, {
        balance: <AdaValue showCurrency value={currentDelegationBalance} />,
      }),

      fmtdMsg(messages.keyDelegation__currentDelegation.id, {
        poolHash: <PoolHashLink poolHash={currentPoolHashDelegatedTo} />,
      }),
    ],
  }
}

const poolCreationMessages = defineMessages({
  webpage: 'Pool has website {webpage}',
  owners: 'has owners {owners}',
  vrfKey: 'has public VRF key {vrfKey}',
  hotKey: 'has public hot key {hotKey}',
  coldKey: 'has public cold key {coldKey}',
  cost: 'has cost of {cost}',
  margin: 'has margin of {margin}',
  pledge: 'has pledge of {pledge}',
})

const poolCreationMessage = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {stakepoolOwners, stakepool} = action
  const {cost, margin, pledge, webpage, vrfKey, hotKey, coldKey} = stakepool
  return [
    fmtdMsg(poolCreationMessages.webpage.id, {
      webpage: <ExternalLink to={webpage}>{webpage}</ExternalLink>,
    }),
    fmtdMsg(poolCreationMessages.owners.id, {
      owners: (
        <React.Fragment key={1}>
          {stakepoolOwners.map((owner, index) => (
            <React.Fragment key={index}>
              {stakepoolOwners.length - 1 !== index ? (
                <React.Fragment>
                  <StakingKeyLink stakingKey={owner} />
                  {', '}
                </React.Fragment>
              ) : (
                <StakingKeyLink stakingKey={owner} />
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ),
    }),
    tr(poolCreationMessages.vrfKey, {vrfKey}),
    tr(poolCreationMessages.hotKey, {hotKey}),
    tr(poolCreationMessages.coldKey, {coldKey}),
    fmtdMsg(poolCreationMessages.cost.id, {
      cost: <FormattedCost showSign="auto" value={cost} />,
    }),
    fmtdMsg(poolCreationMessages.margin.id, {
      margin: <FormattedMargin showSign="auto" value={margin} />,
    }),
    fmtdMsg(poolCreationMessages.pledge.id, {
      pledge: <FormattedPledge showSign="auto" value={pledge} />,
    }),
  ]
}

const poolCreation = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {poolHash} = action
  return {
    label: tr(messages.poolCreation__label),
    value: [
      fmtdMsg(messages.poolCreation__value.id, {
        poolHash: <PoolHashLink poolHash={poolHash} />,
      }),
      <span key={1}>
        {poolCreationMessage({action, i18n}).map((msg, index, msgArray) => (
          <React.Fragment key={index}>
            {msg}
            {index === msgArray.length - 1 ? '.' : ', '}
          </React.Fragment>
        ))}
      </span>,
    ],
  }
}

const FormattedCost = ({value, showSign = 'always'}) => (
  <AdaValue showSign={showSign} showCurrency value={value} />
)
const FormattedMargin = ({value, showSign = 'always'}) => {
  const {formatPercent} = useI18n()
  return formatPercent(value)
}
const FormattedPledge = ({value, showSign = 'always'}) => (
  <AdaValue showSign={showSign} showCurrency value={value} />
)

const POOL_UPDATE_UPDATED_PROP = {
  COST: ({value}) =>
    fmtdMsg(messages.poolUpdate__costChanged.id, {
      value: <FormattedCost value={value} />,
    }),
  MARGIN: ({value}) =>
    fmtdMsg(messages.poolUpdate__marginChanged.id, {
      value: <FormattedMargin value={value} />,
    }),
  PLEDGE: ({value}) =>
    fmtdMsg(messages.poolUpdate__pledgeChanged.id, {
      value: <FormattedPledge value={value} />,
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
  const {translate: tr} = i18n
  return {
    label: tr(messages.poolUpdate__label),
    value: [
      fmtdMsg(messages.poolUpdate__value.id, {
        poolHash: <PoolHashLink poolHash={poolHash} />,
      }),
      ...poolUpdateRelatedMessages({
        wasRetiringDuringUpdate,
        poolExists,
        isInRetirement,
        retirementTxHash,
        i18n,
      }),
      ...updatedProperties.map(({type, value}, index) => {
        const UpdatedProp = POOL_UPDATE_UPDATED_PROP[type]
        return <UpdatedProp key={index} value={value} />
      }),
    ],
  }
}

const poolDeletion = ({action, i18n}) => {
  const {translate: tr} = i18n
  const {rewardsEpoch} = action
  return {
    label: tr(messages.poolDeletion__label),
    value: [
      fmtdMsg(messages.poolDeletion__value.id, {
        epoch: <Link to={routeTo.epoch(rewardsEpoch)}>{rewardsEpoch}</Link>,
      }),
    ],
  }
}

const poolRetirement = ({action, i18n}) => {
  const {translate: tr} = i18n
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
    value: [
      fmtdMsg(messages.poolRetirement__value.id, {
        poolHash: <PoolHashLink poolHash={poolHash} />,
        epoch,
      }),
      poolExistsMessage({poolExists, i18n}),
      retiring && tr(messages.poolRetiring),
      fmtdMsg(messages.poolCreatedAtTxHash.id, {
        txHash: <TxHashLink txHash={createdAtTxHash} />,
      }),
      previousUpdatedAtTxHash &&
        fmtdMsg(messages.poolPreviousUpdatedAtTxHash.id, {
          txHash: <TxHashLink txHash={previousUpdatedAtTxHash} />,
        }),
      nextUpdatedAtTxHash &&
        fmtdMsg(messages.poolNextUpdatedAtTxHash.id, {
          txHash: <TxHashLink txHash={nextUpdatedAtTxHash} />,
        }),
    ],
  }
}

const poolRetirementCancellation = ({action, i18n}) => {
  const {poolHash, epochNumber} = action
  const {translate: tr} = i18n

  return {
    label: tr(messages.poolRetirementCancellation__label),
    value: [
      fmtdMsg(messages.poolRetirementCancellation__value.id, {
        poolHash: <PoolHashLink poolHash={poolHash} />,
        epochNumber,
      }),
    ],
  }
}

const AdditionalRowLabel = ({children}) => (
  <Typography variant="body1" color="textSecondary">
    {children}
  </Typography>
)

const DepositRow = ({value}) => {
  const {translate: tr} = useI18n()
  return (
    <Row hideSeparator>
      <AdditionalRowLabel>{tr(messages.deposit)}</AdditionalRowLabel>
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
      <AdditionalRowLabel>{tr(messages.refund)}</AdditionalRowLabel>
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
      <AdditionalRowLabel>{tr(messages.txHash)}</AdditionalRowLabel>
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

const ActionList = ({actions, showTxHash}) => {
  const classes = useStyles()
  const i18n = useI18n()
  return (
    <div className={classes.wrapper}>
      {actions.map((action, index) => {
        const {label, value} = GET_RENDER_CONTENT[action.type]({action, i18n})
        return (
          <React.Fragment key={index}>
            <Divider />
            {/* Any way to avoid DesktopOnly and MobileOnly? */}
            <DesktopOnly>
              <DesktopAction {...{action, label, value}} />
            </DesktopOnly>
            <MobileOnly>
              <MobileAction {...{action, label, value}} />
            </MobileOnly>
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
