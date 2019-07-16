// @flow
import React from 'react'
import {defineMessages} from 'react-intl'

import {AdaValue} from '@/components/common'

const fieldsMessages = defineMessages({
  adaStaked: 'Ada staked',
  fullness: 'Fullness',
  margins: 'Margins',
  performance: 'Performance',
  rewards: 'Rewards',
  keysDelegating: 'Keys delegating',
  stakersCount: 'Stakers count',
  createdAt: 'Created at',
})

type GetValueParams = {
  data: Object,
  NA: string,
  formatPercent: Function,
  formatInt: Function,
  formatTimestamp: Function,
}

type GetLabelParams = {
  tr: Function,
}

export const fieldsConfig = [
  {
    field: 'adaStaked',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.adaStaked),
    getValue: ({data, NA}: GetValueParams) => (
      <AdaValue value={data.adaStaked} noValue={NA} showCurrency />
    ),
  },
  {
    field: 'fullness',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.fullness),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.fullness),
  },
  {
    field: 'margins',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.margins),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.margins),
  },
  {
    field: 'performance',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.performance),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.performance),
  },
  {
    field: 'rewards',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.rewards),
    getValue: ({data, NA}: GetValueParams) => (
      <AdaValue value={data.rewards} noValue={NA} showCurrency />
    ),
  },
  {
    field: 'keysDelegating',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.keysDelegating),
    getValue: ({data, NA, formatInt}: GetValueParams) => formatInt(data.keysDelegating),
  },
  {
    field: 'createdAt',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.createdAt),
    getValue: ({data, NA, formatTimestamp}: GetValueParams) => formatTimestamp(data.keysDelegating),
  },
  {
    field: 'stakersCount',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.stakersCount),
    getValue: ({data, NA, formatInt}: GetValueParams) => formatInt(data.stakersCount),
  },
]
