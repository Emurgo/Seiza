import React from 'react'
import {defineMessages} from 'react-intl'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {compose} from 'redux'
import idx from 'idx'
import {withI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {LoadingInProgress, DebugApolloError, AdaValue, Link} from '@/components/visual'
import Table, {ROW_TYPE} from '@/components/visual/Table'

const GET_STAKE_POOLS_IN_EPOCH = gql`
  query($epochNumber: Int!) {
    stakePoolList(epochNumber: $epochNumber) {
      poolHash
      name
      summary {
        performance
        adaStaked
        rewards
        keysDelegating
      }
    }
  }
`

const messages = defineMessages({
  name: 'Name',
  performance: 'Performance',
  adaStaked: 'ADA Staked',
  rewards: 'Rewards Received',
  keysDelegating: 'Keys Delegating',
})

const StakingPools = ({i18n, stakePoolsData}) => {
  const {translate, formatPercent, formatInt} = i18n
  const {loading, error, stakePoolList} = stakePoolsData

  const headerData = [
    translate(messages.name),
    translate(messages.performance),
    translate(messages.adaStaked),
    translate(messages.rewards),
    translate(messages.keysDelegating),
  ]

  const bodyData = idx(stakePoolList, (poolList) =>
    poolList.map((pool, index) => ({
      type: ROW_TYPE.DATA,
      data: [
        <Link key={1} to={routeTo.stakepool(idx(pool, (_) => _.poolHash))}>
          {idx(pool, (_) => _.name)}
        </Link>,
        formatPercent(idx(pool, (_) => _.summary.performance)),
        <AdaValue key={index} value={idx(pool, (_) => _.summary.adaStaked)} />,
        <AdaValue key={index} value={idx(pool, (_) => _.summary.rewards)} />,
        formatInt(idx(pool, (_) => _.summary.keysDelegating)),
      ],
    }))
  )

  return loading ? (
    <LoadingInProgress />
  ) : error ? (
    <DebugApolloError error={error} />
  ) : (
    <Table bodyData={bodyData} headerData={headerData} />
  )
}

export default compose(
  withI18n,
  graphql(GET_STAKE_POOLS_IN_EPOCH, {
    name: 'stakePoolsData',
    options: ({epochNumber}) => ({
      variables: {epochNumber},
    }),
  })
)(StakingPools)
