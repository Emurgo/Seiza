// @flow

import _ from 'lodash'
import * as React from 'react'
import {defineMessages} from 'react-intl'

import {AdaValue} from '@/components/common'
import {ItemIdentifier} from '@/components/common/ComparisonMatrix/utils'
import {PercentageSlider, AdaSlider, IntegerSlider, TextFilter} from './Filters'
import {rTo2Decimals} from './helpers'

import type {SliderRange, RangeFilterConfig, TextFilterConfig} from './types'

const fieldsMessages = defineMessages({
  adaStaked: 'Ada staked',
  fullness: 'Fullness',
  margins: 'Margins',
  performance: 'Performance',
  rewards: 'Rewards',
  keysDelegating: 'Keys delegating',
  stakersCount: 'Stakers count',
  createdAt: 'Created at',
  name: 'Name',
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

export const FILTER_TYPES = {
  range: 'RANGE',
  text: 'TEXT',
}

type Config = {
  field: string,
  getLabel: Function,
  getValue: Function,
  filter?: {
    type: $Values<typeof FILTER_TYPES>,
    Component: React.ComponentType<any>,
    isFilterActive: Function,
    dataMatchFilter: Function,
  },
}

const isRangeFilterActive = (filterConfig: RangeFilterConfig) => {
  const {value, range} = filterConfig
  return value && (value[0] > range[0] || value[1] < range[1])
}

const isTextFilterActive = (filterConfig: TextFilterConfig) => filterConfig.value

const getIsInRangeFunction = (round = (v) => v) => (data: number, value: SliderRange) => {
  const r = round
  return r(data) >= r(value[0]) && r(data) <= r(value[1])
}

const isInPercentRange = getIsInRangeFunction(rTo2Decimals)
const isInRange = getIsInRangeFunction()

const matchTextFilter = (data: string, value: ?string) => {
  // Note: we may want some "fuzzy" approach here
  return data.toLowerCase().includes(value ? value.toLocaleLowerCase() : '')
}

const percentageFieldFilterConfig = {
  Component: PercentageSlider,
  type: FILTER_TYPES.range,
  isFilterActive: isRangeFilterActive,
  dataMatchFilter: isInPercentRange,
}

const adaFieldFilterConfig = {
  Component: AdaSlider,
  type: FILTER_TYPES.range,
  isFilterActive: isRangeFilterActive,
  dataMatchFilter: isInRange,
}

const integerFieldFilterConfig = {
  Component: IntegerSlider,
  type: FILTER_TYPES.range,
  isFilterActive: isRangeFilterActive,
  dataMatchFilter: isInRange,
}

const textFieldFilterConfig = {
  Component: TextFilter,
  type: FILTER_TYPES.text,
  isFilterActive: isTextFilterActive,
  dataMatchFilter: matchTextFilter,
}

export const fieldsConfig: Array<Config> = [
  {
    field: 'name',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.name),
    getValue: ({data}: GetValueParams) => (
      <ItemIdentifier title={data.name} identifier={data.poolHash} />
    ),
    filter: textFieldFilterConfig,
  },
  {
    field: 'adaStaked',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.adaStaked),
    getValue: ({data, NA}: GetValueParams) => (
      <AdaValue value={data.adaStaked} noValue={NA} showCurrency />
    ),
    filter: adaFieldFilterConfig,
  },
  {
    field: 'fullness',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.fullness),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.fullness),
    filter: percentageFieldFilterConfig,
  },
  {
    field: 'margins',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.margins),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.margins),
    filter: percentageFieldFilterConfig,
  },
  {
    field: 'performance',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.performance),
    getValue: ({data, formatPercent}: GetValueParams) => formatPercent(data.performance),
    filter: percentageFieldFilterConfig,
  },
  {
    field: 'rewards',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.rewards),
    getValue: ({data, NA}: GetValueParams) => (
      <AdaValue value={data.rewards} noValue={NA} showCurrency />
    ),
    filter: adaFieldFilterConfig,
  },
  {
    field: 'keysDelegating',
    getLabel: ({tr}: GetLabelParams) => tr(fieldsMessages.keysDelegating),
    getValue: ({data, NA, formatInt}: GetValueParams) => formatInt(data.keysDelegating),
    filter: integerFieldFilterConfig,
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
    filter: integerFieldFilterConfig,
  },
]

export const fieldsConfigMap = _.keyBy(fieldsConfig, (conf) => conf.field)

export const rangeFields = fieldsConfig
  .filter((c) => c.filter && c.filter.type === FILTER_TYPES.range)
  .map<string>((c) => c.field)

export const nonTitleFieldsConfig: Array<Config> = fieldsConfig.filter((c) => c.field !== 'name')
