// @flow
import React from 'react'
import gql from 'graphql-tag'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {graphql} from 'react-apollo'

import {KeyValueCard, SimpleLayout, LoadingInProgress, DebugApolloError} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'home.generalInfo'
const CARD_HEADERS = `${I18N_PREFIX}.cardHeaders`
const GENERAL_INFO = `${I18N_PREFIX}.generalInfoCard`
const SLOT_INFO = `${I18N_PREFIX}.slotInfoCard`

const POLL_INTERVAL = 1000 * 60
const SLOT_POLL_INTERVAL = 1000 * 10

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'General info',
  },
})

const generalInfoMessages = defineMessages({
  blocks: {
    id: `${GENERAL_INFO}.blocks`,
    defaultMessage: 'Blocks:',
  },
  transactions: {
    id: `${GENERAL_INFO}.transactions`,
    defaultMessage: 'Txs:',
  },
  movements: {
    id: `${GENERAL_INFO}.movements`,
    defaultMessage: 'Movements:',
  },
  totalFees: {
    id: `${GENERAL_INFO}.fees`,
    defaultMessage: 'Fees:',
  },
  addresses: {
    id: `${GENERAL_INFO}.addresses`,
    defaultMessage: 'Addresses:',
  },
  emptySlotsCount: {
    id: `${GENERAL_INFO}.emptySlotsCount`,
    defaultMessage: 'Empty slots:',
  },
})

const slotInfoMessages = defineMessages({
  supply: {
    id: `${SLOT_INFO}.supply`,
    defaultMessage: 'Supply:',
  },
  transactions: {
    id: `${SLOT_INFO}.transactions`,
    defaultMessage: 'Txs:',
  },
  totalSent: {
    id: `${SLOT_INFO}.totalSent`,
    defaultMessage: 'Sent:',
  },
  totalFees: {
    id: `${SLOT_INFO}.totalFees`,
    defaultMessage: 'Fees:',
  },
})

const cardHeaders = defineMessages({
  totalLabel: {
    id: `${CARD_HEADERS}.totalLabel`,
    defaultMessage: 'Total',
  },
  totalValue: {
    id: `${CARD_HEADERS}.totalValue`,
    defaultMessage: 'From Genesis',
  },
  epochLabel: {
    id: `${CARD_HEADERS}.epochLabel`,
    defaultMessage: 'Epoch',
  },
  last24HoursLabel: {
    id: `${CARD_HEADERS}.last24HoursLabel`,
    defaultMessage: 'Last',
  },
  last24HoursValue: {
    id: `${CARD_HEADERS}.last24HoursValue`,
    defaultMessage: '24 Hours',
  },
  slotLabel: {
    id: `${CARD_HEADERS}.slotLabel`,
    defaultMessage: 'Slot',
  },
})

const styles = () =>
  createStyles({
    row: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
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

const Row = withStyles(styles)(({children, classes}) => (
  <Grid container direction="row" justify="space-around" className={classes.row} spacing={24}>
    {children}
  </Grid>
))

const facadeQueryData = (queryData, dataKey) => ({
  data: queryData[dataKey],
  loading: queryData.loading,
  error: queryData.error,
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
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />

  const items = fields.map((fieldDesc) => ({
    label: fieldDesc.label,
    value: fieldDesc.getValue(data[fieldDesc.id]),
  }))
  return (
    <KeyValueCard header={<KeyValueCard.Header label={cardLabel} value={cardValue} />}>
      <KeyValueCard.Body items={items} />
    </KeyValueCard>
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
  }),
  withStyles(styles)
)(({classes, i18n: {translate}, currentStatusProvider: {loading, error, currentStatus}}) => {
  if (loading) return <LoadingInProgress />
  if (error) return <DebugApolloError error={error} />

  // TODO (richard): currently we pass blockCount (which seems to be calculated as slotCount)
  // Do we want info about last Slot or Block? (probably Block)
  // Leaving Slot for now, probably will change

  return (
    <SimpleLayout title={translate(messages.header)} width="1200px">
      <Row>
        <Grid item xs={6}>
          <GeneralInfoGenesis />
        </Grid>
        <Grid item xs={6}>
          <GeneralInfoLastEpoch epoch={currentStatus.epochNumber} />
        </Grid>
      </Row>
      <Row>
        <Grid item xs={6}>
          <GeneralInfo24Hours />
        </Grid>
        <Grid item xs={6}>
          <SlotInfoCard epoch={currentStatus.epochNumber} slot={currentStatus.blockCount} />
        </Grid>
      </Row>
    </SimpleLayout>
  )
})
