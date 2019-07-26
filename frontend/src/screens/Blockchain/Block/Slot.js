// @flow

import React from 'react'
import idx from 'idx'
import useReactRouter from 'use-react-router'
import {Redirect, Route} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {useQuery} from 'react-apollo-hooks'
import gql from 'graphql-tag'

import {MetadataOverrides, seoMessages} from '@/pages/_meta'
import NotFound from '../NotFound'
import {SimpleLayout, SummaryCard, LoadingDots} from '@/components/visual'
import {LoadingError} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {isInteger} from '@/helpers/validators'
import {routeTo} from '@/helpers/routes'
import {extractError} from '@/helpers/errors'
import SlotNavigation from './SlotNavigation'

const messages = defineMessages({
  title: 'Slot',
  emptySlotTitle: 'Ooups this slot is empty',
  NA: 'N/A',
})

const metadata = defineMessages({
  screenTitle: 'Cardano Slot {slot} in Epoch {epoch} | Seiza',
  metaDescription: 'Cardano Slot {slot} in Epoch {epoch}. Date: {date}',
  keywords: 'Slot {slot} in Epoch {epoch}, Epoch {epoch}, Cardano Slot, {commonKeywords}',
})

const slotSummaryLabels = defineMessages({
  epoch: 'Epoch',
  slot: 'Slot',
  issuedAt: 'Timestamp',
})

const SlotSummaryCard = ({slotData, loading}) => {
  const {translate: tr, formatInt, formatTimestamp} = useI18n()

  const label = slotSummaryLabels

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{tr(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  const NA = loading ? <LoadingDots /> : tr(messages.NA)

  const data = {
    epoch: formatInt(idx(slotData, (_) => _.epoch), {defaultValue: NA}),
    slot: formatInt(idx(slotData, (_) => _.slot), {defaultValue: NA}),
    issuedAt: formatTimestamp(idx(slotData, (_) => _.timeIssued), {defaultValue: NA}),
  }

  return (
    <SummaryCard>
      <Item label={label.epoch}>{data.epoch}</Item>
      <Item label={label.slot}>{data.slot}</Item>
      <Item label={label.issuedAt}>{data.issuedAt}</Item>
    </SummaryCard>
  )
}

const useSlotData = (epoch: number, slot: number) => {
  const result = useQuery(
    gql`
      query($epoch: Int, $slot: Int) {
        slot(epoch: $epoch, slot: $slot) {
          blockHash
          slot
          epoch
          timeIssued
          isEmpty
          nextBlock {
            blockHash
          }
          previousBlock {
            blockHash
          }
        }
      }
    `,
    {
      variables: {epoch, slot},
    }
  )
  const {loading, error, data} = result
  return {loading, error: extractError(error, ['slot']), slotData: data.slot}
}

// FIXME: this needs testing once slots work again!
// http://localhost:3000/blockchain/epoch/133/slot/11387
const SlotMetadata = ({slot, epoch, slotData}) => {
  const {translate: tr, formatTimestamp} = useI18n()

  const title = tr(metadata.screenTitle, {slot, epoch})

  const desc = tr(metadata.metaDescription, {
    slot,
    epoch,
    date: formatTimestamp(idx(slotData, (_) => _.timeIssued), {tz: 'UTC'}),
  })

  const keywords = tr(metadata.keywords, {
    slot,
    epoch,
    commonKeywords: tr(seoMessages.keywords),
  })

  return <MetadataOverrides title={title} description={desc} keywords={keywords} />
}

const validateParam = (param: string) => isInteger(param) && parseInt(param, 10) >= 0

const EmptySlot = () => {
  const {translate: tr} = useI18n()
  const {
    match: {
      params: {epoch, slot},
    },
  } = useReactRouter()
  const {loading, error, slotData} = useSlotData(parseInt(epoch, 10), parseInt(slot, 10))

  if (!validateParam(slot) || !validateParam(epoch)) return <Route component={NotFound} />

  const blockHash = idx(slotData, (_) => _.blockHash)
  const isEmpty = idx(slotData, (_) => _.isEmpty)

  if (blockHash) return <Redirect exact to={routeTo.block(blockHash)} />

  // TODO: 404 error (when frontend/backend error hadling PR is merged)

  return (
    <SimpleLayout title={tr(isEmpty ? messages.emptySlotTitle : messages.title)}>
      <SlotMetadata slot={slot} epoch={epoch} slotData={slotData} />
      <SlotNavigation slot={slotData} />
      {error ? <LoadingError error={error} /> : <SlotSummaryCard {...{loading, slotData}} />}
    </SimpleLayout>
  )
}

export default EmptySlot
