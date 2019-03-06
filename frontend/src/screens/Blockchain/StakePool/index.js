// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {withRouter} from 'react-router'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'

import {
  EntityIdCard,
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  DebugApolloError,
} from '@/components/visual'

import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'stakepool.fields'

const summaryLabels = defineMessages({
  name: {
    id: `${I18N_PREFIX}.name`,
    defaultMessage: 'Name',
  },
  description: {
    id: `${I18N_PREFIX}.description`,
    defaultMessage: 'Description',
  },
})

const _PoolSummaryCard = ({i18n, pool}) => {
  const {translate} = i18n

  const label = summaryLabels

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  return (
    <SummaryCard>
      <Item label={label.name}>{pool.name}</Item>
      <Item label={label.description}>{pool.description}</Item>
    </SummaryCard>
  )
}

const PoolSummaryCard = compose(withI18n)(_PoolSummaryCard)

const messages = defineMessages({
  title: {
    id: 'blockchain.stakepool.title',
    defaultMessage: '<Stake pool>',
  },
  poolHash: {
    id: 'blockchain.stakepool.blockHash',
    defaultMessage: 'Pool ID',
  },
})

const StakePool = ({poolDataProvider, i18n}) => {
  const {loading, stakePool, error} = poolDataProvider
  const {translate} = i18n

  return (
    <SimpleLayout title={translate(messages.title)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <EntityIdCard label={translate(messages.poolHash)} value={stakePool.poolHash} />
          <PoolSummaryCard pool={stakePool} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

const GET_POOL_BY_HASH = gql`
  query($poolHash: String!) {
    stakePool(poolHash: $poolHash) {
      poolHash
      name
      description
    }
  }
`

export default compose(
  withRouter,
  withProps((props) => ({
    poolHash: props.match.params.poolHash,
  })),
  graphql(GET_POOL_BY_HASH, {
    name: 'poolDataProvider',
    options: ({poolHash}) => {
      return {
        variables: {poolHash},
      }
    },
  }),
  withI18n
)(StakePool)
