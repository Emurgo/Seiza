import {CERT_ACTIONS_TYPES} from './actionTypes'

export const MOCKED_KEY_REGISTRATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION,
  stakingKey: '7e38711c7c4104c1c7c8806a81eefde742b7f9d4800d630d5e26f981da',
  deposit: '500000',
  previousDeregistrationTx: {
    txHash: 'c8a6e019befe29d77fe419b33ea0f90081260bd1776eccc0810bfdf16a',
  },
  nextDeregistrationTx: {
    txHash: '948ea0650b237599abf36a33df57b9db1327f70b28841707cec4ea7d69',
  },
  tx: {
    txHash: 'f1d5909ae22553a8a077b29167abe03f346b6ab8b041293c74a2cf6da7',
  },
}

export const MOCKED_KEY_DEREGISTRATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION,
  stakingKey: '1f7e7b60096e7f113623701abb474315ce9a1f6d42fca94f2b18c06fc0',
  refund: '500000',
  previousRegistrationTx: {txHash: 'f26e8b357e0c0e5e116143d3adc40cbfe412e76002f0f6a436f2fe17ba'},
  nextRegistrationTx: {txHash: 0x017491},
  tx: {
    txHash: '2bc4b144b244a489d22c9039fb800627735be72cc2af98fb82c6a471e8',
  },
}
export const MOCKED_KEY_REWARD_RECEIPT_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT,
  stakingKey: '0a244142bda4448fa1dd7e32a1b69292bc25fe2b7c369ad372d1d83614',
  reward: '8000000',
  poolHash: '160d9baa3d4525a97ef8dd1050c49f88879349925934eea0a46e846e01',
  performance: 0.54,
  maxReward: '100000000',
  tx: {
    txHash: '46133a8e2e1c0d7f8efa07e4c4af59f645d97970e256e27612d80f32ef',
  },
}
export const MOCKED_KEY_REGISTRATION_AS_POOL_OWNER_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER,
  stakingKey: 'eb8b27906f2720cd8f52dd46e4ac2221cf929260d225d1f50f889e89b1',
  poolHash: '25e3ffeefe60b79310f240f1b19dd8cd4f42114586848f7c52a0caa035',
  wasRetiringDuringUpdate: true,
  poolExists: true,
  isInRetirement: true,
  retirementTxHash: 'd753c2529673fe94620c91c3e78bd8363edffc4a0ec8ab7faa5d07e916',
  tx: {
    txHash: 'ddde72dcf04a5521a7ce92668667f197f032e1e3440d1acbfd6ab29f96',
  },
}
export const MOCKED_KEY_DEREGISTRATION_AS_POOL_OWNER_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER,
  stakingKey: '4ebd066beb6dcced0914d521722d2857d2422641e5c9e1518fee2c89bd',
  poolHash: '9dfb4515330d6e036e5effec4ea2c5a6478087168bb235a200456e81d9',
  wasRetiringDuringUpdate: true,
  poolExists: true,
  isInRetirement: true,
  retirementTxHash: '41aa3cf7b94924f548faeab32c81cd6819098e1f748151c2d0dae82c86',
  tx: {
    txHash: '5c2f2dabecdeb1a075f39b9a1dc861c59a31e439cab7ba01eadb527aa7',
  },
}
export const MOCKED_KEY_REGISTRATION_AS_POOL_REWARD_TARGET_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET,
  stakingKey: 'fd5f850d15d6e8fd1d895951cb7bc1abce3f7cacbdb8ac085dd242041d',
  poolHash: '96804d442274296851c1c7ed60349c988572e5c76ce78c9920c522f3e3',
  prevRewardTarget: '5a5c12615c3abc0a6ec85b5708085301e135d0b0405e417a2da31cd293',
  currentRewardTarget: 'b759726a5f2eb821a528127cf35266c2e06232fb7a3f111aebaffcb6c4',
  tx: {
    txHash: 'fd074206eb632e9591c0c656ba0662ca49e3d5a3a40439a05e0bb3da74',
  },
}
export const MOCKED_KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET,
  stakingKey: '640359aa703f943ddc3548e374dde92c4e22aec2d3421655211d29253a',
  poolHash: 'ad4b6fc4c0ca21cabfc477fd013bd8f9ca0d49e8790b1a4a7e84e5aa53',
  prevRewardTarget: 'abbfaa7786da8f7293479eb2e4a3aadc5a7d2b0da6cabb7c88dcc84526',
  currentRewardTarget: 'a9975bb986992914b250cc8892785f0757415590b06a3a39be833935f9',
  tx: {
    txHash: 'fc0d0a7f2dec22ce7789aee85ba2999672afe38d1b8c91c574fc62bf3c',
  },
}
export const MOCKED_KEY_DELEGATION_ACTION = {
  type: CERT_ACTIONS_TYPES.KEY_DELEGATION,
  stakingKey: 'fe3b31864680adee494f057096f597e48ffca81ecef234bab4f82e935c',
  stakingKeyExists: true,
  poolHash: '5f4f1f67a3df46385572384851e13ca5238d2b53387075120db4b2863e',
  txHash: 'ee1099aad4f3af3bf31e27eeef1dd3f294074b9f65815d4b3f34886957',
  previousDelegatedToTxHash: 'f56d7c459bc481744aa37223b0bdddd7ff15c34530d5c13513ce724db3',
  nextDelegatedToTxHash: '3b4cc1ca27152266f4ab6ac7068b7ca0680741ad0f4cbc0d9900278f2b',
  delegationBalance: '9000000',
  currentDelegationBalance: '1000',
  currentPoolHashDelegatedTo: 'dd39feb591918e8f0789e165d0a466491fd28747449f685b0ac3c3c5df',
  tx: {
    txHash: 'a8e4b4c74e77533544690330ffa53ab9c3090558c5e598cefba5912313',
  },
}

export const MOCKED_POOL_CREATION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_CREATION,
  epoch: 42,
  poolHash: '2949094071fb042c7c9bd01a47ce9ab408df1109f3acf18b128e077c96',
  deposit: '500000',
  tx: {
    txHash: 'f706e734af341162221bd5cafba01a9687a37e59fb428198f64fa381ed',
  },
}
export const MOCKED_POOL_UPDATE_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_UPDATE,
  poolHash: '4e769bd7263bd2efcc0acddb94d4bbe33f20fc373caa79ed8678e1f5cc',
  wasRetiringDuringUpdate: true,
  isInRetirement: true,
  retirementTxHash: 'bd000196883d006c757209280e881bbdd83a98c8f1bb082e33bd5e80d1',
  lastRetirement: '2019-02-13T10:58:31.000Z',
  poolExists: true,
  tx: {
    txHash: '11d9e1434718f8828f8b1e326cacba3f386fcfb29734552864b73a12fd',
  },
}
export const MOCKED_POOL_DELETION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_DELETION,
  tx: {
    txHash: 'b6e76d4c14afe3bf44b06e38b8c2e7e25da59be3445b449f51c13831cb',
  },
}
export const MOCKED_POOL_RETIREMENT_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_RETIREMENT,
  poolHash: 'd611877a5b1522f4c2b5de8357ce97535403d14841aacd81d5b68f46d9',
  epoch: 45,
  poolExists: true,
  retiring: true,
  createdAtTxHash: 'bcb02ec8356412133131940728dffbefd59210f8e6c052e39b0ca8cee1',
  previousUpdatedAtTxHash: '357fb411e52f3ffa23a56fa59414d869734bf2921ece6b790b9d05b6b7',
  nextUpdatedAtTxHash: '1b4e0bc450086b86b42fb542dfa9d6b8f8dc049cfe743c1824e5f91e3d',
  refund: '500000',
  tx: {
    txHash: '571f16c8fec64fe103f0b5b6dc8e846c29ab7494a3135f4b62a439af0c',
  },
}
export const MOCKED_POOL_RETIREMENT_CANCELLATION_ACTION = {
  type: CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION,
  poolHash: '3dfcecfcdaca703b3c1a1594d7e4f5fad38d47d691cf6ec11101ab8d7d',
  epochNumber: 32,

  tx: {
    txHash: 'e37426f23ab33d51213e9ce5492be922f4d08a7bd7b6a1ffc3fdd9306b',
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
