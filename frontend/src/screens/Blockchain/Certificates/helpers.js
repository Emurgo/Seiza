// @flow
export const CERT_TYPES = {
  KEY_REGISTERED: 'KEY_REGISTERED',
  KEY_DEREGISTERED: 'KEY_DEREGISTERED',
  POOL_RETIRING: 'POOL_RETIRING',
}

export const MOCKED_CERTIFICATES = [
  {
    type: CERT_TYPES.KEY_REGISTERED,
    deposit: '500000',
    stakingKey: '0x12345',
    deregisteredStakingKey: '0x98765',
  },
  {type: CERT_TYPES.KEY_DEREGISTERED, deposit: '500000', stakingKey: '0x123456'},
  {type: CERT_TYPES.POOL_RETIRING, stakingKey: '0x123456', epoch: 42},
  {type: CERT_TYPES.POOL_RETIRING, stakingKey: '0x726181', epoch: 45},
]

export type CertificateType = string
