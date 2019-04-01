// @flow

import React from 'react'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import {Paper, Typography} from '@material-ui/core'
import {People as OwnersIcon, ViewHeadline as StatsIcon} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useSelectedPoolsContext} from '../context/selectedPools'
import {useI18n} from '@/i18n/helpers'
import {Tab, Tabs, LoadingInProgress, LoadingError} from '@/components/visual'
import WithTabState from '@/components/headless/tabState'
import PeopleList from './PeopleList'
import Stats from './Stats'

const messages = defineMessages({
  owners: 'Owners',
  stats: 'Stats',
  noData: 'There are no pools selected.', // TODO: unify no data messages
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  loadingWrapper: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  error: {
    padding: theme.spacing.unit * 2,
  },
  noPools: {
    padding: theme.spacing.unit * 2,
  },
}))

// TODO: probably will be part of stake pool
const mockedOwners = [
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862a',
    pledge: '34354354354354354',
  },
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862b',
    pledge: '4354354354354354',
  },
  {
    stakingKey: 'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862c',
    pledge: '354354354354354',
  },
]

const PoolDataFragment = gql`
  fragment ComparisonMatrixDataFragment on BootstrapEraStakePool {
    poolHash
    name
    summary {
      adaStaked
      stakersCount
      averageUserStaking
      usersAdaStaked
      ownerPledge {
        declared
        actual
      }
    }
  }
`

const useLoadPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          ...ComparisonMatrixDataFragment
        }
      }
      ${PoolDataFragment}
    `,
    {
      variables: {poolHashes},
    }
  )

  const stakePools = (data.stakePools || []).map((pool) => ({...pool, owners: mockedOwners}))
  return {stakePools, loading, error}
}

const NoDataComponent = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return <Typography className={classes.noPools}>{tr(messages.noData)}</Typography>
}

const ErrorComponent = ({error}) => {
  const classes = useStyles()
  return (
    <div className={classes.error}>
      <LoadingError error={error} />
    </div>
  )
}

const LoadingComponent = () => {
  const classes = useStyles()
  return (
    <div className={classes.loadingWrapper}>
      <LoadingInProgress />
    </div>
  )
}

const withLoadingAndErrorHadler = (BaseComponent) => ({
  data,
  loading,
  error,
  NoDataComponent,
  ErrorComponent,
  LoadingComponent,
  ...restProps
}) => {
  if (loading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  if (!loading && !data.length) return <NoDataComponent />

  return <BaseComponent data={data} {...restProps} />
}

const TABS = {
  OWNERS: withLoadingAndErrorHadler(PeopleList),
  STATS: withLoadingAndErrorHadler(Stats),
}

const TAB_NAMES = Object.keys(TABS)

const People = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  const {error, loading, stakePools} = useLoadPoolsData()

  return (
    <WithTabState tabNames={TAB_NAMES}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS[currentTabName]
        return (
          <Paper className={classes.wrapper}>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab icon={<OwnersIcon />} label={tr(messages.owners)} />
              <Tab icon={<StatsIcon />} label={tr(messages.stats)} />
            </Tabs>
            <TabContent
              data={stakePools}
              {...{loading, error, NoDataComponent, ErrorComponent, LoadingComponent}}
            />
          </Paper>
        )
      }}
    </WithTabState>
  )
}

export default People
