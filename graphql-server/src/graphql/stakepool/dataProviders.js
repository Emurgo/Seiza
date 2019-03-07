import assert from 'assert'
import moment from 'moment'

export const BOOTSTRAP_POOLS = [
  'af2800c124e599d6dec188a75f8bfde397ebb778163a18240371f2d1',
  '1deb82908402c7ee3efeb16f369d97fba316ee621d09b32b8969e54b',
  '43011479a595b300e0726910d0b602ffcdd20466a3b8ceeacd3fbc26',
  '5071d8802ddd05c59f4db907bd1749e82e6242caf6512b20a8368fcf',
  '5411c7bf87c252609831a337a713e4859668cba7bba70a9c3ef7c398',
  '65904a89e6d0e5f881513d1736945e051b76f095eca138ee869d543d',
  '6c9e14978b9d6629b8703f4f25e9df6ed4814b930b8403b0d45350ea',
]

export const fetchBootstrapEraPoolSummary = (api, poolHash, epochNumber) => {
  // TODO: consider poolHash and epochNumber
  // Note (temporary): `randomFactor` is used to mock different data for sortBy actions etc,
  // but to produce same `randomFactor` for same hash
  const prefixLength = 5
  const maxBase58CharValue = 122
  const randomFactor = poolHash
    .slice(0, prefixLength)
    .split('')
    .reduce((res, value, index, src) => res + src[index].charCodeAt(0) / maxBase58CharValue, 1)
  const normalizedFactor = randomFactor / prefixLength

  return {
    adaStaked: '1413135',
    keysDelegating: 100,
    performance: 0.7 * normalizedFactor,
    pledge: `${Math.ceil(142432243 * normalizedFactor)}`,
    rewards: `${Math.ceil(5135534 * normalizedFactor)}`,
    fullness: 0.6 * normalizedFactor,
    margins: 0.3 * normalizedFactor,
    revenue: 0.25 * normalizedFactor,
  }
}

export const fetchBootstrapEraPool = (api, poolHash, epochNumber) => {
  const idx = BOOTSTRAP_POOLS.indexOf(poolHash)
  assert(idx !== -1)
  return {
    poolHash,
    name: `Bootstrap era pool #${idx + 1}`,
    description: 'Pool used before decentralization',
    createdAt: moment(),
    _epochNumber: epochNumber,
  }
}

export const fetchBootstrapEraPoolList = (api, epochNumber) => {
  return BOOTSTRAP_POOLS.map((poolHash) => fetchBootstrapEraPool(api, poolHash, epochNumber))
}
