// @flow

import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'

// TODO: We are using current epoch number in more places, consider
// adding it to context?

export const useCurrentEpoch = () => {
  const {error, loading, data} = useQuery(
    gql`
      query {
        currentStatus {
          epochNumber
        }
      }
    `
  )

  const currentEpoch = data.currentStatus ? data.currentStatus.epochNumber : null
  return {error, loading, currentEpoch}
}
