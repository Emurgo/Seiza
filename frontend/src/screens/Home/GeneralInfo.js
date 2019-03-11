// @flow
import React from 'react'
import gql from 'graphql-tag'
import {Grid} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {graphql} from 'react-apollo'

import {
  KeyValueCard,
  SimpleLayout,
  LoadingOverlay,
  ErrorOverlay,
  Overlay,
} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'

const POLL_INTERVAL = 1000 * 60
const SLOT_POLL_INTERVAL = 1000 * 10

const messages = defineMessages({
  header: 'General info',
})

const generalInfoMessages = defineMessages({
  blocks: 'Blocks:',
  transactions: 'Txs:',
  movements: 'Movements:',
  totalFees: 'Fees:',
  addresses: 'Addresses:',
  emptySlotsCount: 'Empty slots:',
})

const slotInfoMessages = defineMessages({
  supply: 'Supply:',
  transactions: 'Txs:',
  totalSent: 'Sent:',
  totalFees: 'Fees:',
})

const cardHeaders = defineMessages({
  totalLabel: 'Total',
  totalValue: 'From Genesis',
  epochLabel: 'Epoch',
  last24HoursLabel: 'Last',
  last24HoursValue: '24 Hours',
  slotLabel: 'Slot',
})

const getGeneralFields = ({translate, formatAda, formatInt}) => [
  {
    id: 'blocksCount',
    label: translate(generalInfoMessages.blocks),
    getValue: (rawValue) => formatInt(rawValue),
  },
  {
    id: 'txCount',
    label: translate(generalInfoMessages.transactions),
    getValue: (rawValue) => formatInt(rawValue),
  },
  {
    id: 'movements',
    label: translate(generalInfoMessages.movements),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'totalFees',
    label: translate(generalInfoMessages.totalFees),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'addresses',
    label: translate(generalInfoMessages.addresses),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'emptySlotsCount',
    label: translate(generalInfoMessages.emptySlotsCount),
    getValue: (rawValue) => formatInt(rawValue),
  },
]

const getSlotFields = ({translate, formatAda, formatInt, formatTimestamp}) => [
  {
    id: 'supply',
    label: translate(slotInfoMessages.supply),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'txCount',
    label: translate(slotInfoMessages.transactions),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'totalSent',
    label: translate(slotInfoMessages.totalSent),
    getValue: (rawValue) => formatAda(rawValue),
  },
  {
    id: 'totalFees',
    label: translate(slotInfoMessages.totalFees),
    getValue: (rawValue) => formatAda(rawValue),
  },
]

export const GENERAL_INFO_FRAGMENT = gql`
  fragment BasicGeneralInfo on GeneralInfo {
    blocksCount
    txCount
    totalFees
    movements
    addresses
    emptySlotsCount
  }
`

const GET_GENERAL_INFO = gql`
  query($infoPeriod: InfoPeriod!) {
    generalInfo(infoPeriod: $infoPeriod) {
      ...BasicGeneralInfo
    }
  }
  ${GENERAL_INFO_FRAGMENT}
`

const GET_EPOCH_INFO = gql`
  query($epoch: Int!) {
    epochInfo(epoch: $epoch) {
      ...BasicGeneralInfo
    }
  }
  ${GENERAL_INFO_FRAGMENT}
`

const GET_SLOT_INFO = gql`
  query($epoch: Int!, $slot: Int!) {
    slotInfo(epoch: $epoch, slot: $slot) {
      supply
      txCount
      totalSent
      totalFees
    }
  }
`

const Row = ({children}) => (
  <Grid container direction="row" justify="space-around" spacing={24}>
    {children}
  </Grid>
)

// Note(ppershing): queryData will be undefined if we are skipping the query
// so we need to deal with it explicitly
const facadeQueryData = (queryData, dataKey) => ({
  data: queryData && queryData[dataKey],
  loading: !queryData || queryData.loading,
  error: queryData && queryData.error,
})

const OVERVIEW_METRICS_QUERY = gql`
  query {
    currentStatus {
      epochNumber
      blockCount
    }
  }
`

const _InfoCard = ({data, fields, cardLabel, cardValue, loading, error}) => {
  const items = fields.map((fieldDesc) => ({
    label: fieldDesc.label,
    value: data && fieldDesc.getValue(data[fieldDesc.id]),
  }))

  return (
    <Overlay.Wrapper>
      <KeyValueCard header={<KeyValueCard.Header label={cardLabel} value={cardValue} />}>
        <KeyValueCard.Body items={items} />
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={!loading && error} />
      </KeyValueCard>
    </Overlay.Wrapper>
  )
}

const SlotInfoCard = compose(
  withI18n,
  graphql(GET_SLOT_INFO, {
    name: 'slotInfoProvider',
    options: ({epoch, slot}) => ({
      variables: {epoch, slot},
      pollInterval: SLOT_POLL_INTERVAL,
    }),
    skip: ({epoch, slot}) => epoch == null || slot == null,
  }),
  withProps(({i18n, slotInfoProvider, slot}) => ({
    cardLabel: i18n.translate(cardHeaders.slotLabel),
    cardValue: slot,
    fields: getSlotFields(i18n),
    ...facadeQueryData(slotInfoProvider, 'slotInfo'),
  }))
)(_InfoCard)

const GeneralInfoGenesis = compose(
  withI18n,
  graphql(GET_GENERAL_INFO, {
    name: 'generalInfoProvider',
    options: {
      pollInterval: POLL_INTERVAL,
      variables: {infoPeriod: 'ALL_TIME'},
    },
  }),
  withProps(({i18n, generalInfoProvider}) => ({
    cardLabel: i18n.translate(cardHeaders.totalLabel),
    cardValue: i18n.translate(cardHeaders.totalValue),
    fields: getGeneralFields(i18n),
    ...facadeQueryData(generalInfoProvider, 'generalInfo'),
  }))
)(_InfoCard)

const GeneralInfo24Hours = compose(
  withI18n,
  graphql(GET_GENERAL_INFO, {
    name: 'generalInfoProvider',
    options: {
      variables: {infoPeriod: 'LAST_24_HOURS'},
      pollInterval: POLL_INTERVAL,
    },
  }),
  withProps(({i18n, generalInfoProvider}) => ({
    cardLabel: i18n.translate(cardHeaders.last24HoursLabel),
    cardValue: i18n.translate(cardHeaders.last24HoursValue),
    fields: getGeneralFields(i18n),
    ...facadeQueryData(generalInfoProvider, 'generalInfo'),
  }))
)(_InfoCard)

const GeneralInfoLastEpoch = compose(
  withI18n,
  graphql(GET_EPOCH_INFO, {
    name: 'epochInfoProvider',
    options: ({epoch}) => ({
      variables: {epoch},
      pollInterval: POLL_INTERVAL,
    }),
    skip: ({epoch}) => epoch == null,
  }),
  withProps(({i18n, epochInfoProvider, epoch}) => {
    return {
      cardLabel: i18n.translate(cardHeaders.epochLabel),
      cardValue: epoch,
      fields: getGeneralFields(i18n),
      ...facadeQueryData(epochInfoProvider, 'epochInfo'),
    }
  })
)(_InfoCard)

export default compose(
  withI18n,
  graphql(OVERVIEW_METRICS_QUERY, {
    name: 'currentStatusProvider',
    options: () => ({
      pollInterval: POLL_INTERVAL,
    }),
  })
)(({classes, i18n: {translate}, currentStatusProvider: {loading, error, currentStatus}}) => {
  // TODO (richard): currently we pass blockCount (which seems to be calculated as slotCount)
  // Do we want info about last Slot or Block? (probably Block)
  // Leaving Slot for now, probably will change

  const epoch = currentStatus && currentStatus.epochNumber
  const slot = currentStatus && currentStatus.blockCount

  return (
    <SimpleLayout title={translate(messages.header)} maxWidth="1200px">
      <Row>
        <Grid item xs={6}>
          <GeneralInfoGenesis />
        </Grid>
        <Grid item xs={6}>
          <GeneralInfoLastEpoch epoch={epoch} />
        </Grid>
      </Row>
      <Row>
        <Grid item xs={6}>
          <GeneralInfo24Hours />
        </Grid>
        <Grid item xs={6}>
          <SlotInfoCard epoch={epoch} slot={slot} />
        </Grid>
      </Row>
    </SimpleLayout>
  )
})
