// @flow

import * as React from 'react'
import gql from 'graphql-tag'
import {defineMessages} from 'react-intl'
import {useQuery} from 'react-apollo-hooks'

import InfoCard from './InfoCard'
import Layout from './Layout'

import {SimpleLayout, AdaValue, LoadingError} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {useCurrentEpoch} from './common'

import {ReactComponent as EpochIcon} from '@/static/assets/icons/epoch.svg'
import {ReactComponent as FromGenesisIcon} from '@/static/assets/icons/from-genesis.svg'

// TODO: how often are snapshots created? Do we want to periodically load `Current snapshot`?

const messages = defineMessages({
  header: 'Stake Pool',
  NA: 'N/A',
})

const allTimeInfoMessages = defineMessages({
  blocksCreated: 'Blocks created:',
  blocksMissed: 'Blocks missed:',
  totalPoolsCreated: 'Total Stake Pools created:',
})

const perEpochInfoMessages = defineMessages({
  totalStakedAmount: 'Total Staking',
  poolsCount: 'Stake Pools',
  totalBlocksCreated: 'Blocks created',
  totalBlocksMissed: 'Blocks missed',
  rewardsPerBlock: 'Rewards per block',
})

const cardHeaders = defineMessages({
  total: 'Total:',
  currentSnapshot: 'Current snapshot:',
  previousSnapshot: 'Previous snapshot:',
  nextSnapshot: 'Next snapshot:',
  fromGenesis: 'From genesis',
  usedInEpoch: 'Used in epoch {epoch}',
  willBeUsedInEpoch: 'Will be used in epoch {epoch}',
})

const getAllTimeFields = ({translate, formatInt}) => [
  {
    label: translate(allTimeInfoMessages.blocksCreated),
    getValue: (data) => formatInt(data.blocksCreated),
  },
  {
    label: translate(allTimeInfoMessages.blocksMissed),
    getValue: (data) => formatInt(data.blocksMissed),
  },
  {
    label: translate(allTimeInfoMessages.totalPoolsCreated),
    getValue: (data) => formatInt(data.totalPoolsCreated),
  },
]

const getPerEpochFields = ({translate, formatInt}) => [
  {
    label: translate(perEpochInfoMessages.totalStakedAmount),
    getValue: (data) => <AdaValue value={data.totalStakedAmount} />,
  },
  {
    label: translate(perEpochInfoMessages.poolsCount),
    getValue: (data) => formatInt(data.poolsCount),
  },
  {
    label: translate(perEpochInfoMessages.totalBlocksCreated),
    getValue: (data) => formatInt(data.totalBlocksCreated),
  },
  {
    label: translate(perEpochInfoMessages.totalBlocksMissed),
    getValue: (data) => formatInt(data.totalBlocksMissed),
  },
  {
    label: translate(perEpochInfoMessages.rewardsPerBlock),
    getValue: (data) => <AdaValue value={data.rewardsPerBlock} />,
  },
]

const AllTimeCard = () => {
  const formatters = useI18n()
  const {error, loading, data} = useQuery(
    gql`
      query {
        allTimeStakingSummary {
          blocksCreated
          blocksMissed
          totalPoolsCreated
        }
      }
    `
  )
  return (
    <InfoCard
      fields={getAllTimeFields(formatters)}
      data={data && data.allTimeStakingSummary}
      cardValue={formatters.translate(cardHeaders.fromGenesis)}
      cardLabel={formatters.translate(cardHeaders.total)}
      icon={<FromGenesisIcon />}
      {...{loading, error}}
    />
  )
}

type PerEpochCardProps = {|
  cardLabel: string,
  cardValue: string,
  epoch: ?number,
|}

const useEpochSummary = (epoch) => {
  const skip = epoch == null
  const {error, loading, data} = useQuery(
    gql`
      query($epoch: Int!) {
        perEpochStakingSummary(epoch: $epoch) {
          totalStakedAmount
          poolsCount
          totalBlocksCreated
          totalBlocksMissed
          rewardsPerBlock
        }
      }
    `,
    {
      variables: {epoch},
      skip,
    }
  )
  return {error, loading, data: data && data.perEpochStakingSummary}
}

const PerEpochCard = ({cardLabel, cardValue, epoch}: PerEpochCardProps) => {
  const formatters = useI18n()
  const {error, loading, data} = useEpochSummary(epoch)
  return (
    <InfoCard
      fields={getPerEpochFields(formatters)}
      icon={<EpochIcon />}
      {...{cardLabel, cardValue, error, loading, data}}
    />
  )
}

export default () => {
  const {translate: tr} = useI18n()

  const {error, loading, currentEpoch} = useCurrentEpoch()

  if (!loading && error) {
    return (
      <SimpleLayout title={tr(messages.header)} maxWidth="1200px">
        <LoadingError error={error} />
      </SimpleLayout>
    )
  }

  const {Section, Row, Item} = Layout
  return (
    <Section title={tr(messages.header)}>
      <Row>
        <Item>
          <AllTimeCard />
        </Item>
        <Item>
          {/* For now not solving case when there is no `previousEpoch`. Possibly
              we will show only `N/A` values. Depends on server implementation. */}
          <PerEpochCard
            cardValue={tr(cardHeaders.usedInEpoch, {
              epoch:
                currentEpoch != null
                  ? currentEpoch >= 1
                    ? currentEpoch - 1
                    : tr(messages.NA)
                  : '',
            })}
            cardLabel={tr(cardHeaders.previousSnapshot)}
            epoch={currentEpoch !== null ? currentEpoch - 1 : null}
          />
        </Item>
      </Row>
      <Row>
        <Item>
          <PerEpochCard
            cardValue={tr(cardHeaders.usedInEpoch, {
              epoch: currentEpoch != null ? currentEpoch : '',
            })}
            cardLabel={tr(cardHeaders.currentSnapshot)}
            epoch={currentEpoch != null ? currentEpoch : null}
          />
        </Item>
        <Item>
          <PerEpochCard
            cardValue={tr(cardHeaders.willBeUsedInEpoch, {
              epoch: currentEpoch != null ? currentEpoch + 1 : '',
            })}
            cardLabel={tr(cardHeaders.nextSnapshot)}
            epoch={currentEpoch !== null ? currentEpoch + 1 : null}
          />
        </Item>
      </Row>
    </Section>
  )
}
