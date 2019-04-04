// @flow

import React, {useRef} from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'

import {
  EntityIdCard,
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  LoadingError,
} from '@/components/visual'

import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {useI18n} from '@/i18n/helpers'

const summaryLabels = defineMessages({
  name: 'Name',
  description: 'Description',
})

const PoolSummaryCard = ({stakePoolData}) => {
  const {translate} = useI18n()

  const label = summaryLabels

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  return (
    <SummaryCard>
      <Item label={label.name}>{stakePoolData.name}</Item>
      <Item label={label.description}>{stakePoolData.description}</Item>
    </SummaryCard>
  )
}

const messages = defineMessages({
  title: 'Stake pool',
  poolHash: 'Pool ID',
})

const GET_POOL_BY_HASH = gql`
  query($poolHash: String!) {
    stakePool(poolHash: $poolHash) {
      poolHash
      name
      description
    }
  }
`

const useStakePoolData = (poolHash) => {
  const {loading, error, data} = useQuery(GET_POOL_BY_HASH, {
    variables: {
      poolHash,
    },
  })
  return {loading, error, stakePoolData: data.stakePool}
}

const StakePool = () => {
  const {
    match: {
      params: {poolHash},
    },
  } = useReactRouter()
  const {loading, stakePoolData, error} = useStakePoolData(poolHash)
  const {translate} = useI18n()
  const scrollToRef = useRef()

  useScrollFromBottom(scrollToRef, [stakePoolData])

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.title)}>
        <EntityIdCard label={translate(messages.poolHash)} value={poolHash} />
        {loading ? (
          <LoadingInProgress />
        ) : error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <PoolSummaryCard stakePoolData={stakePoolData} />
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default StakePool
