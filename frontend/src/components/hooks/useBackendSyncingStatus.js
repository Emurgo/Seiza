// @flow
import idx from 'idx'
import gql from 'graphql-tag'
import dayjs from '@/dayjs'
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
    ? dayjs(status.currentTime)
      .subtract(1, 'minute')
      .isAfter(dayjs(status.dataAvailableUpTo))
    : null

  const syncedUpTo = status ? status.dataAvailableUpTo : null

  return {syncedUpTo, isBehind, error}
}
