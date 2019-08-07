// @flow
import idx from 'idx'
import React, {useRef} from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'

import {MetadataOverrides, seoMessages} from '@/pages/_meta'
import {SummaryCard, SimpleLayout, LoadingInProgress} from '@/components/visual'
import {LoadingError, EntityIdCard} from '@/components/common'

import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/components/context/googleAnalytics'
import Pool from '@/screens/Blockchain/StakingKey/Pool'

const summaryLabels = defineMessages({
  name: 'Name',
  description: 'Description',
})

const metadata = defineMessages({
  screenTitle: 'Slot Leader {poolHash} | Seiza',
  metaDescription: 'Cardano Slot Leader: {poolHash}. Name: {poolName}. Description: {description}.',
  keywords: 'Cardano Slot Leader {poolHash}, {commonKeywords}',
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

// Note: We check directly for this hash (link from More screen)
// to access mocked stakepool (non-bootstrap)
// TODO: remove NON_BOOTSTRAP_POOL_HASH once we have real data
export const NON_BOOTSTRAP_POOL_HASH =
  'eccbc87e4b5ce2fe28308fd9f2a7baf3a87ff679a2f3e71d9181a67b7542122c'

const SlotLeaderMetadata = ({poolHash, poolData}) => {
  const {translate: tr} = useI18n()

  const title = tr(metadata.screenTitle, {poolHash})

  const desc = tr(metadata.metaDescription, {
    poolHash,
    poolName: idx(poolData, (_) => _.name),
    description: idx(poolData, (_) => _.description),
  })

  const keywords = tr(metadata.keywords, {
    poolHash,
    commonKeywords: tr(seoMessages.keywords),
  })

  return <MetadataOverrides title={title} description={desc} keywords={keywords} />
}

const BootstrapPool = ({poolHash}: {poolHash: string}) => {
  const {loading, stakePoolData, error} = useStakePoolData(poolHash)
  const {translate} = useI18n()
  const scrollToRef = useRef()

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('stakepool')

  useScrollFromBottom(scrollToRef, stakePoolData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.title)}>
        <SlotLeaderMetadata poolHash={poolHash} poolData={stakePoolData} />
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

const StakePool = () => {
  const {
    match: {
      params: {poolHash},
    },
  } = useReactRouter()
  // TODO: remove NON_BOOTSTRAP_POOL_HASH once we have real data
  return poolHash === NON_BOOTSTRAP_POOL_HASH ? <Pool /> : <BootstrapPool poolHash={poolHash} />
}

export default StakePool
