// @flow

import React from 'react'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {LiteTabs, LiteTab, LoadingInProgress, LoadingError, Card} from '@/components/visual'
import {getPadding as getLiteTabDefaultPadding} from '@/components/visual/LiteTabs'
import useTabState from '@/components/hooks/useTabState'
import {useSelectedPoolsContext} from '../context/selectedPools'
import PeopleList from './PeopleList'
import Stats from './Stats'

const messages = defineMessages({
  owners: 'Owners',
  stats: 'Stats',
  noData: 'There are no pools selected.', // TODO: unify no data messages
})

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
    },
  },
  loadingWrapper: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  error: {
    padding: theme.spacing(2),
  },
  noPools: {
    padding: theme.spacing(2),
  },
}))

const useTabWrapperStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
      marginTop: 0,
    },
  },
  fixTabsPadding: {
    paddingLeft: getLiteTabDefaultPadding(theme),
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
    },
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

const useLoadPoolsData = () => {
  const {selectedPools: poolHashes} = useSelectedPoolsContext()
  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
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
      }
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
  const tabWrapperClasses = useTabWrapperStyles()
  const {error, loading, stakePools} = useLoadPoolsData()
  const {setTabByEventIndex, currentTabIndex} = useTabState(TAB_NAMES)
  const TabContent = TABS[TAB_NAMES[currentTabIndex]]

  return (
    <React.Fragment>
      <div className={tabWrapperClasses.root}>
        {/* TODO: When className is applied
        for LiteTabs it's used twice hence why this wrapper */}
        <div className={tabWrapperClasses.fixTabsPadding}>
          <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
            <LiteTab label={tr(messages.owners)} />
            <LiteTab label={tr(messages.stats)} />
          </LiteTabs>
        </div>
      </div>
      <Card classes={classes}>
        <TabContent
          data={stakePools}
          {...{loading, error, NoDataComponent, ErrorComponent, LoadingComponent}}
        />
      </Card>
    </React.Fragment>
  )
}

export default People
