// @flow
import idx from 'idx'
import gql from 'graphql-tag'
import moment from 'moment-timezone'
import {useQuery} from 'react-apollo-hooks'

export const useBackendSyncingStatus = () => {
  const {error, data} = useQuery(
    gql`
      query {
        currentStatus {
          currentTime
          dataAvailableUpTo
        }
      }
    `,
    {
      pollInterval: 20000,
    }
  )

  const status = idx(data, (_) => _.currentStatus)

  const isBehind = status
    ? moment(status.currentTime)
      .subtract(1, 'minute')
      .isAfter(moment(status.dataAvailableUpTo))
    : null

  const syncedUpTo = status ? status.dataAvailableUpTo : null

  return {syncedUpTo, isBehind, error}
}
