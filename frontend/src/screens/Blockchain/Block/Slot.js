// @flow

import React from 'react'
import idx from 'idx'
import useReactRouter from 'use-react-router'
import {Redirect, Route} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {useQuery} from 'react-apollo-hooks'
import gql from 'graphql-tag'

import NotFound from '../NotFound'
import {SimpleLayout, SummaryCard, LoadingDots, LoadingError} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {isInteger} from '@/helpers/validators'
import {routeTo} from '@/helpers/routes'
import SlotNavigation from './SlotNavigation'

const messages = defineMessages({
  title: 'Slot',
  emptySlotTitle: 'Ooups this slot is empty',
  NA: 'N/A',
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
  return {loading, error, slotData: data.slot}
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
      <SlotNavigation slot={slotData} />
      {error ? <LoadingError error={error} /> : <SlotSummaryCard {...{loading, slotData}} />}
    </SimpleLayout>
  )
}

export default EmptySlot
