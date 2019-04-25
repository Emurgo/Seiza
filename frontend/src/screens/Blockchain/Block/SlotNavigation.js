// @flow

import React, {useCallback} from 'react'
import useReactRouter from 'use-react-router'
import idx from 'idx'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import NavigationButtons from '../NavigationButtons'

const useSlotNavigation = (slot: any) => {
  const {history} = useReactRouter()

  const prevHash = idx(slot, (_) => _.previousBlock.blockHash)
  const nextHash = idx(slot, (_) => _.nextBlock.blockHash)
  const linkPrev = prevHash ? routeTo.block(prevHash) : null
  const linkNext = nextHash ? routeTo.block(nextHash) : null

  const goPrev = useCallback(() => history.push(linkPrev), [history, linkPrev])
  const goNext = useCallback(() => history.push(linkNext), [history, linkNext])

  return {
    hasPrev: !!prevHash,
    linkPrev,
    goPrev,
    hasNext: !!nextHash,
    linkNext,
    goNext,
  }
}

const messages = defineMessages({
  goPreviousBlock: 'Previous Block',
  goNextBlock: 'Next Block',
})

// TODO: use proper flow type
const SlotNavigation = ({slot}: any) => {
  const {translate} = useI18n()

  const nav = useSlotNavigation(slot)
  return (
    <NavigationButtons
      {...nav}
      prevMessage={translate(messages.goPreviousBlock)}
      nextMessage={translate(messages.goNextBlock)}
    />
  )
}

export default SlotNavigation
