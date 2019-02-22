import assert from 'assert'

const bootstrapPools = [
  'af2800c124e599d6dec188a75f8bfde397ebb778163a18240371f2d1',
  '1deb82908402c7ee3efeb16f369d97fba316ee621d09b32b8969e54b',
  '43011479a595b300e0726910d0b602ffcdd20466a3b8ceeacd3fbc26',
  '5071d8802ddd05c59f4db907bd1749e82e6242caf6512b20a8368fcf',
  '5411c7bf87c252609831a337a713e4859668cba7bba70a9c3ef7c398',
  '65904a89e6d0e5f881513d1736945e051b76f095eca138ee869d543d',
  '6c9e14978b9d6629b8703f4f25e9df6ed4814b930b8403b0d45350ea',
]

export const fetchBootstrapEraPool = (api, poolHash) => {
  const idx = bootstrapPools.indexOf(poolHash)
  assert(idx !== -1)
  return {
    poolHash,
    name: `Bootstrap era pool #${idx + 1}`,
    description: 'Pool used before decentralization',
  }
}
