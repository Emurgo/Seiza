// @flow
import gql from 'graphql-tag'
import idx from 'idx'
import {useQuery} from 'react-apollo-hooks'

import {useSelectedPoolsContext} from '../context/selectedPools'

// Note: given same hash, we get same coordinates
const generateGpsCoordinates = (hash) => {
  const hashSum = hash.split('').reduce((acc, char, index) => acc + hash.charCodeAt(index), 0)
  const isEven = hashSum % 2 === 0

  const lng = (hashSum % 180) * (isEven ? 1 : -1)
  const lat = (hashSum % 90) * (isEven ? -1 : 1)

  return {lat, lng}
}

export const useLoadSelectedPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {loading, error, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
          poolHash
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )

  const stakePools: Array<{}> = (idx(data, (_) => _.stakePools) || []).map((p) => ({
    ...p,
    location: generateGpsCoordinates(p.poolHash),
  }))

  return {loading, error, data: stakePools}
}
