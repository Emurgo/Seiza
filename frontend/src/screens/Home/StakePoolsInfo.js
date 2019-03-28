// @flow

import * as React from 'react'
import gql from 'graphql-tag'
import {Grid} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {useQuery} from 'react-apollo-hooks'

import {
  KeyValueCard,
  SimpleLayout,
  LoadingOverlay,
  ErrorOverlay,
  Overlay,
  AdaValue,
  LoadingError,
} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

// TODO: icons
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
  total: 'Total',
  currentSnapshot: 'Current snapshot',
  previousSnapshot: 'Previous snapshot',
  nextSnapshot: 'Next snapshot',
  fromGenesis: 'From genesis',
  usedInEpoch: 'Used in epoch {epoch}',
  willBeUsedInEpoch: 'Will be used in epoch {epoch}',
})

type Field = {|
  label: string,
  getValue: Function,
|}

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

const Row = ({children}: {children: React.Node}) => (
  <Grid container direction="row" justify="space-around" spacing={24}>
    {children}
  </Grid>
)

type InfoCardProps = {|
  data: Object, // TODO: get graphql type
  fields: Array<Field>,
  cardLabel: string,
  cardValue: string,
  loading: boolean,
  error: any,
|}

const InfoCard = ({data, fields, cardLabel, cardValue, loading, error}: InfoCardProps) => {
  const items = fields.map((fieldDesc) => ({
    label: fieldDesc.label,
    value: data && fieldDesc.getValue(data),
  }))

  return (
    <Overlay.Wrapper className="h-100">
      <KeyValueCard
        className="h-100"
        header={<KeyValueCard.Header label={cardLabel} value={cardValue} />}
      >
        <KeyValueCard.Body items={items} />
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={!loading && error} />
      </KeyValueCard>
    </Overlay.Wrapper>
  )
}

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
      {...{cardLabel, cardValue, error, loading, data}}
    />
  )
}

const useCurrentEpoch = () => {
  const {error, loading, data} = useQuery(
    gql`
      query {
        currentStatus {
          epochNumber
        }
      }
    `
  )

  const currentEpoch = data.currentStatus ? data.currentStatus.epochNumber : null
  return {error, loading, currentEpoch}
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

  return (
    <SimpleLayout title={tr(messages.header)} maxWidth="1200px">
      <Row>
        <Grid item xs={6}>
          <AllTimeCard />
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
      </Row>
      <Row>
        <Grid item xs={6}>
          <PerEpochCard
            cardValue={tr(cardHeaders.usedInEpoch, {
              epoch: currentEpoch != null ? currentEpoch : '',
            })}
            cardLabel={tr(cardHeaders.currentSnapshot)}
            epoch={currentEpoch != null ? currentEpoch : null}
          />
        </Grid>
        <Grid item xs={6}>
          <PerEpochCard
            cardValue={tr(cardHeaders.willBeUsedInEpoch, {
              epoch: currentEpoch != null ? currentEpoch + 1 : '',
            })}
            cardLabel={tr(cardHeaders.nextSnapshot)}
            epoch={currentEpoch !== null ? currentEpoch + 1 : null}
          />
        </Grid>
      </Row>
    </SimpleLayout>
  )
}
