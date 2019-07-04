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
    tx: {
      txHash: '1551aef38e78d3c06f00fa6dda81affccef0aea25bfdcdc16e2921e87ce8149c',
      timestamp: '2019-02-13T10:58:31.000Z',
    },
  },
  {
    type: CERT_TYPES.KEY_DEREGISTERED,
    deposit: '500000',
    stakingKey: '0x123456',
    tx: {
      txHash: '1551aef38e78d3c06f00fa6dda81affccef0aea25bfdcdc16e2921e87ce8149c',
      timestamp: '2019-02-13T10:58:31.000Z',
    },
  },
  {
    type: CERT_TYPES.POOL_RETIRING,
    stakingKey: '0x123456',
    epoch: 42,
    tx: {
      txHash: '1551aef38e78d3c06f00fa6dda81affccef0aea25bfdcdc16e2921e87ce8149c',
      timestamp: '2019-02-13T10:58:31.000Z',
    },
  },
  {
    type: CERT_TYPES.POOL_RETIRING,
    stakingKey: '0x726181',
    epoch: 45,
    tx: {
      txHash: '1551aef38e78d3c06f00fa6dda81affccef0aea25bfdcdc16e2921e87ce8149c',
      timestamp: '2019-02-13T10:58:31.000Z',
    },
  },
]

export type CertificateType = string
