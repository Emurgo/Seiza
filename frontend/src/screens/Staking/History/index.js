// @flow
import React, {useState, useMemo} from 'react'
import _ from 'lodash'
import gql from 'graphql-tag'
import idx from 'idx'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {useQuery} from 'react-apollo-hooks'

import {getPageCount} from '@/helpers/utils'
import {Card, Pagination} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

import {useSelectedPoolsContext} from '../context/selectedPools'
import {getMockedHistory} from './mockedData'
import {WithEnsureStakePoolsLoaded} from '../utils'
import {POOL_ACTION_RENDERERS} from './common'

const ROWS_PER_PAGE = 5

const messages = defineMessages({
  epoch: 'Epoch:',
})

export const useLoadSelectedPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {loading, error, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          name
        }
      }
    `,
    {
      variables: {poolHashes},
    }
  )
  return {loading, error, data: idx(data, (_) => _.stakePools)}
}

// TODO: styles & layout
const HistoryCard = ({changes, epochNumber}) => {
  const {translate: tr} = useI18n()
  return (
    <Card>
      <Grid container>
        <Grid item xs={12}>
          <Typography>
            {tr(messages.epoch)} {epochNumber}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {_.map(changes, (value, key) => {
            const poolName = key
            const poolChanges = value
            return (
              <Grid container key={poolName}>
                <Grid item xs={12}>
                  {poolName}
                </Grid>
                <Grid item xs={12}>
                  {_.map(poolChanges, (value, key) => {
                    const Renderer = POOL_ACTION_RENDERERS[key]
                    return <Renderer key={key} value={value} />
                  })}
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </Card>
  )
}

const HistoryCards = ({stakePools}) => {
  // TODO: get current epoch
  const currentEpoch = 50
  const poolNames = useMemo(() => stakePools.map((p) => p.name), [stakePools])
  const changesData = useMemo(() => getMockedHistory(poolNames, currentEpoch), [poolNames])
  const [page, setPage] = useState(1)

  const currentChanges = changesData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  return (
    <React.Fragment>
      <Pagination
        pageCount={getPageCount(changesData.length, ROWS_PER_PAGE)}
        page={page}
        onChangePage={setPage}
      />
      {currentChanges.map(({epochNumber, changes}) => (
        <HistoryCard key={epochNumber} {...{epochNumber, changes}} />
      ))}
    </React.Fragment>
  )
}

const HistoryScreen = () => {
  const {loading, error, data} = useLoadSelectedPoolsData()
  return (
    <WithEnsureStakePoolsLoaded {...{loading, error, data}}>
      {({data: stakePools}) => <HistoryCards stakePools={stakePools} />}
    </WithEnsureStakePoolsLoaded>
  )
}

export default HistoryScreen
