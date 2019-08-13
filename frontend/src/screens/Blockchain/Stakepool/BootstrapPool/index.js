// @flow
import React, {useRef} from 'react'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'

import {LoadingError, EntityIdCard} from '@/components/common'
import {SummaryCard, SimpleLayout, LoadingInProgress} from '@/components/visual'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {useAnalytics} from '@/components/context/googleAnalytics'
import {useI18n} from '@/i18n/helpers'
import {MetadataOverrides, seoMessages} from '@/pages/_meta'

const metadata = defineMessages({
  screenTitle: 'Slot Leader {poolHash} | Seiza',
  metaDescription: 'Cardano Slot Leader: {poolHash}. Name: {poolName}. Description: {description}.',
  keywords: 'Cardano Slot Leader {poolHash}, {commonKeywords}',
})

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

export default BootstrapPool
