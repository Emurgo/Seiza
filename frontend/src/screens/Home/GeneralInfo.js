// @flow
import React from 'react'
import gql from 'graphql-tag'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withProps} from 'recompose'
import {graphql} from 'react-apollo'

import {AdaValue} from '@/components/visual'
import Layout from './Layout'
import InfoCard from './InfoCard'
import {withI18n} from '@/i18n/helpers'

import {ReactComponent as EpochIcon} from '@/static/assets/icons/epoch.svg'
import {ReactComponent as SlotIcon} from '@/static/assets/icons/slot.svg'
import {ReactComponent as TimeIcon} from '@/static/assets/icons/time.svg'
import {ReactComponent as FromGenesisIcon} from '@/static/assets/icons/from-genesis.svg'

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
  activeAddresses: 'Active addresses:',
  emptySlotsCount: 'Empty slots:',
})

const slotInfoMessages = defineMessages({
  supply: 'Supply:',
  transactions: 'Txs:',
  totalSent: 'Sent:',
  totalFees: 'Fees:',
  timeIssued: 'Time:',
})

const cardHeaders = defineMessages({
  totalLabel: 'Total:',
  totalValue: 'From Genesis',
  epochLabel: 'Epoch:',
  last24HoursLabel: 'Last:',
  last24HoursValue: '24 Hours',
  slotLabel: 'Slot:',
})

const getGeneralFields = ({translate, formatAda, formatInt}) => [
  {
    label: translate(generalInfoMessages.blocks),
    getValue: (data) => formatInt(data.blocksCount),
  },
  {
    label: translate(generalInfoMessages.transactions),
    getValue: (data) => formatInt(data.txCount),
  },
  {
    label: translate(generalInfoMessages.movements),
    getValue: (data) => <AdaValue value={data.movements} />,
  },
  {
    label: translate(generalInfoMessages.totalFees),
    getValue: (data) => <AdaValue value={data.totalFees} />,
  },
  {
    label: translate(generalInfoMessages.activeAddresses),
    getValue: (data) => formatInt(data.activeAddresses),
  },
  {
    label: translate(generalInfoMessages.emptySlotsCount),
    getValue: (data) => formatInt(data.emptySlotsCount),
  },
]

const getSlotFields = ({translate, formatAda, formatInt, formatTimestamp}) => [
  {
    label: translate(slotInfoMessages.supply),
    getValue: (data) => <AdaValue value={data.supply} />,
  },
  {
    label: translate(slotInfoMessages.timeIssued),
    getValue: (data) => formatTimestamp(data.timeIssued),
  },
  {
    label: translate(slotInfoMessages.transactions),
    getValue: (data) => formatInt(data.txCount),
  },
  {
    label: translate(slotInfoMessages.totalSent),
    getValue: (data) => <AdaValue value={data.totalSent} />,
  },
  {
    label: translate(slotInfoMessages.totalFees),
    getValue: (data) => <AdaValue value={data.totalFees} />,
  },
]

export const GENERAL_INFO_FRAGMENT = gql`
  fragment BasicGeneralInfo on GeneralInfo {
    blocksCount
    txCount
    totalFees
    movements
    activeAddresses
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
      timeIssued
    }
  }
`

// Note(ppershing): queryData will be undefined if we are skipping the query
// so we need to deal with it explicitly
const facadeQueryData = (queryData, dataKey, parentError = null) => ({
  data: queryData && queryData[dataKey],
  loading: !parentError && (!queryData || queryData.loading),
  error: parentError || (queryData && queryData.error),
})

const OVERVIEW_METRICS_QUERY = gql`
  query {
    currentStatus {
      epochNumber
      blockCount
    }
  }
`

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
  withProps(({i18n, slotInfoProvider, slot, parentError}) => ({
    cardLabel: i18n.translate(cardHeaders.slotLabel),
    cardValue: i18n.formatInt(slot),
    fields: getSlotFields(i18n),
    ...facadeQueryData(slotInfoProvider, 'slotInfo', parentError),
  }))
)(InfoCard)

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
)(InfoCard)

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
)(InfoCard)

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
  withProps(({i18n, epochInfoProvider, epoch, parentError}) => {
    return {
      cardLabel: i18n.translate(cardHeaders.epochLabel),
      cardValue: i18n.formatInt(epoch),
      fields: getGeneralFields(i18n),
      ...facadeQueryData(epochInfoProvider, 'epochInfo', parentError),
    }
  })
)(InfoCard)

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

  const {Section, Row, Item} = Layout

  return (
    <Section title={translate(messages.header)} maxWidth="1200px">
      <Row>
        <Item>
          <SlotInfoCard epoch={epoch} slot={slot} parentError={error} icon={<SlotIcon />} />
        </Item>
        <Item>
          <GeneralInfo24Hours icon={<TimeIcon />} />
        </Item>
      </Row>
      <Row>
        <Item>
          <GeneralInfoLastEpoch epoch={epoch} parentError={error} icon={<EpochIcon />} />
        </Item>
        <Item>
          <GeneralInfoGenesis icon={<FromGenesisIcon />} />
        </Item>
      </Row>
    </Section>
  )
})
