// @flow

import {defineMessages} from 'react-intl'

const STAKING_KEY_CERTIFICATE_ACTION_TYPES = {
  KEY_REGISTRATION: 'KEY_REGISTRATION',
  KEY_DEREGISTRATION: 'KEY_DEREGISTRATION',
  KEY_REWARD_RECEIPT: 'KEY_REWARD_RECEIPT',
  KEY_REGISTRATION_AS_POOL_OWNER: 'KEY_REGISTRATION_AS_POOL_OWNER',
  KEY_DEREGISTRATION_AS_POOL_OWNER: 'KEY_DEREGISTRATION_AS_POOL_OWNER',
  KEY_REGISTRATION_AS_POOL_REWARD_TARGET: 'KEY_REGISTRATION_AS_POOL_REWARD_TARGET',
  KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET: 'KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET',
  KEY_DELEGATION: 'KEY_DELEGATION',
}

const POOL_CERTIFICATE_ACTION_TYPES = {
  POOL_CREATION: 'POOL_CREATION',
  POOL_UPDATE: 'POOL_UPDATE',
  POOL_DELETION: 'POOL_DELETION',
  POOL_RETIREMENT: 'POOL_RETIREMENT',
  POOL_RETIREMENT_CANCELLATION: 'POOL_RETIREMENT_CANCELLATION',
}

export const CERT_ACTIONS_TYPES = {
  ...STAKING_KEY_CERTIFICATE_ACTION_TYPES,
  ...POOL_CERTIFICATE_ACTION_TYPES,
}

// Note: Kept here just because keys could get easily out of sync
export const actionsSummaryMessages = defineMessages({
  KEY_REGISTRATION: 'Key registered: {count}',
  KEY_DEREGISTRATION: 'Key de-registered: {count}',
  KEY_REWARD_RECEIPT: 'Reward receipts: {count}',
  KEY_REGISTRATION_AS_POOL_OWNER: 'Registrations as Pool Owner: {count}',
  KEY_DEREGISTRATION_AS_POOL_OWNER: 'Deregistrations as Pool Owner: {count}',
  KEY_REGISTRATION_AS_POOL_REWARD_TARGET: 'Key Registrations as Pool Reward Target: {count}',
  KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET: 'Key Deregistrations as Pool Reward Target: {count}',
  KEY_DELEGATION: 'Key delegations: {count}',
  POOL_CREATION: 'Pool creations: {count}',
  POOL_UPDATE: 'Pool updates: {count}',
  POOL_DELETION: 'Pool deletions: {count}',
  POOL_RETIREMENT_CANCELLATION: 'Pool retirement cancellations: {count}',
  POOL_RETIREMENT: 'Pool retirements: {count}',
})

export type CertificateType = string
