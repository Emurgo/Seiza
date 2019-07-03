// @flow

import assert from 'assert'
import gql from 'graphql-tag'
import {useApolloClient, useQuery} from 'react-apollo-hooks'

import {dataIdFromObject} from '@/helpers/apollo'

const PoolNamesFragment = gql`
  fragment PoolNamesFragment on BootstrapEraStakePool {
    poolHash
    name
  }
`

export const useLoadSelectedPoolsData = (selectedPoolsHashes: Array<string>) => {
  const client = useApolloClient()

  const fragmentData = selectedPoolsHashes.map((hash) => {
    const id = dataIdFromObject({__typename: 'BootstrapEraStakePool', poolHash: hash})
    assert(id) // sanity check

    let data = null
    try {
      data = client.readFragment({id, fragment: PoolNamesFragment})
    } catch {
      // readFragment can throw. We do nothing in that case
    }

    return [hash, data]
  })

  const missing = fragmentData
    .filter(([hash, poolData]) => poolData == null)
    .map(([hash, poolData]) => hash)

  const skip = missing.length === 0

  // Note: we use data from fragments.
  // This query is just to fill the cache
  const {error} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          ...PoolNamesFragment
        }
      }
      ${PoolNamesFragment}
    `,
    {
      variables: {poolHashes: missing},
      skip,
    }
  )

  const data = fragmentData.map<{poolHash: string, name: ?string}>(([hash, poolData]) => ({
    poolHash: hash,
    name: poolData && poolData.name,
  }))

  return {error, data}
}
