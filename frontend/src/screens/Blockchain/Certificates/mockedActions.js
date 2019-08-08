import {CERT_ACTIONS_TYPES} from './actionTypes'

export const MOCKED_KEY_REGISTRATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION,
  stakingKey: '0x12345',
  deposit: '500000',
  previousDeregistrationTx: {
    txHash: '0x98765',
  },
  nextDeregistrationTx: {
    txHash: '0x98725',
  },
  tx: {
    txHash: '0x64245523',
  },
}

export const MOCKED_KEY_DEREGISTRATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION,
  stakingKey: '0x12345',
  refund: '500000',
  previousRegistrationTx: {txHash: '0x83838'},
  nextRegistrationTx: {txHash: 0x017491},
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_REWARD_RECEIPT_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT,
  stakingKey: '0x123456',
  reward: '8000000',
  poolHash: '0x51535',
  performance: 0.54,
  maxReward: '100000000',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_REGISTRATION_AS_POOL_OWNER_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER,
  stakingKey: '0x123456',
  poolHash: '0x123123',
  wasRetiringDuringUpdate: true,
  poolExists: true,
  isInRetirement: true,
  retirementTxHash: '0x213132',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_DEREGISTRATION_AS_POOL_OWNER_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER,
  stakingKey: '0x123456',
  poolHash: '0x123123',
  wasRetiringDuringUpdate: true,
  poolExists: true,
  isInRetirement: true,
  retirementTxHash: '0x213132',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_REGISTRATION_AS_POOL_REWARD_TARGET_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET,
  stakingKey: '0x123456',
  poolHash: '0x123123',
  prevRewardTarget: '0x912939',
  currentRewardTarget: '0x915413',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET,
  stakingKey: '0x123456',
  poolHash: '0x123123',
  prevRewardTarget: '0x912939',
  currentRewardTarget: '0x915413',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_KEY_DELEGATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DELEGATION,
  stakingKey: '0x123456',
  stakingKeyExists: true,
  poolHash: '0x777655',
  txHash: '0x912930',
  previousDelegatedToTxHash: '0x1341495',
  nextDelegatedToTxHash: '0x83727',
  delegationBalance: '9000000',
  currentDelegationBalance: '1000',
  currentPoolHashDelegatedTo: '0x912348',
  tx: {
    txHash: '0x64245523',
  },
}

export const MOCKED_POOL_CREATION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_CREATION,
  epoch: 42,
  poolHash: '0x415315',
  deposit: '500000',
  tx: {
    txHash: '0x64245523',
  },
  stakepool: {
    // Note(bigamasta): just some data here copied from stakepool mock
    // we cannot use getStakepool here, because of circular dependency
    vrfKey: 'b331e5415ba39a345b2d3585c1c1b069372ed5d7dfa0ca4c651fdd47',
    hotKey: '9b13a30404e4093f2ca99d1db60deddd17b41e6723ef9dbc4deffe2f',
    coldKey: 'c1ae631a6f9c1d4198a595beb92be18f28e5bcfa780712cfdf891757',
    webpage: 'https://www.warrenbuffettstakepool.com',
    pledge: '10000003723742',
    margin: 0.08,
    cost: '500000000',
  },
  stakepoolOwners: [
    '6e3d7c58ec9dae7689e7febd25708b69d3c0ae3dcd81e2923f7efe5c',
    'd61e92e242e02815391dd8f1e40216bbfe7502b21cb8af4329470f16',
  ],
}

export const MOCKED_POOL_UPDATE_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_UPDATE,
  poolHash: '0x014571',
  wasRetiringDuringUpdate: true,
  isInRetirement: true,
  retirementTxHash: '0x213132',
  lastRetirement: '2019-02-13T10:58:31.000Z',
  poolExists: true,
  updatedProperties: [
    {type: 'MARGIN', value: -0.02},
    {type: 'COST', value: 41254560},
    {type: 'PLEDGE', value: 123958381},
  ],
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_POOL_DELETION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_DELETION,
  rewardsEpoch: 161,
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_POOL_RETIREMENT_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_RETIREMENT,
  poolHash: '0x726181',
  epoch: 45,
  poolExists: true,
  retiring: true,
  createdAtTxHash: '0x94628',
  previousUpdatedAtTxHash: '0x94628',
  nextUpdatedAtTxHash: '0x94628',
  refund: '500000',
  tx: {
    txHash: '0x64245523',
  },
}
export const MOCKED_POOL_RETIREMENT_CANCELLATION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION,
  poolHash: '0x949140',
  epochNumber: 32,

  tx: {
    txHash: '0x64245523',
  },
}

export default [
  MOCKED_KEY_REGISTRATION_ACTION,
  MOCKED_KEY_DEREGISTRATION_ACTION,
  MOCKED_KEY_REWARD_RECEIPT_ACTION,
  MOCKED_KEY_REGISTRATION_AS_POOL_OWNER_ACTION,
  MOCKED_KEY_DEREGISTRATION_AS_POOL_OWNER_ACTION,
  MOCKED_KEY_REGISTRATION_AS_POOL_REWARD_TARGET_ACTION,
  MOCKED_KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET_ACTION,
  MOCKED_KEY_DELEGATION_ACTION,
  MOCKED_POOL_CREATION_ACTION,
  MOCKED_POOL_UPDATE_ACTION,
  MOCKED_POOL_DELETION_ACTION,
  MOCKED_POOL_RETIREMENT_ACTION,
  MOCKED_POOL_RETIREMENT_CANCELLATION_ACTION,
]
