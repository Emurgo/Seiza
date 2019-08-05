// @flow

import _ from 'lodash'
import React, {useCallback, useMemo} from 'react'
import {Grid, TextField} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {CloseIconButton, Slider} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {rTo2Decimals} from './helpers'

import type {SliderRange} from './types'

type FilterSliderProps = {
  label: string,
  min: number,
  max: number,
  onChange: Function,
  value: SliderRange,
  onReset: Function,
  onReset: Function,
  tipFormatter: Function,
  step?: number,
}

// TODO: style
const FilterSlider = ({
  label,
  min,
  max,
  onChange,
  value,
  tipFormatter,
  onReset,
  step,
}: FilterSliderProps) => {
  const [draggingValue, onDraggingChange] = useStateWithChangingDefault(value)
  const onDragEnd = useCallback(() => onChange(draggingValue), [draggingValue, onChange])

  return (
    <div>
      <Grid container justify="flex-end">
        <CloseIconButton onClick={onReset} />
      </Grid>
      <Slider
        value={draggingValue}
        onChange={onDraggingChange}
        {...{min, max, tipFormatter, label, onDragEnd, step}}
      />
    </div>
  )
}

type FilterProps = {
  label: string,
  onChange: Function,
  onReset: Function,
}

type PercentageSliderProps = {
  filterConfig: {value: ?SliderRange, range: SliderRange},
} & FilterProps

export const PercentageSlider = ({
  filterConfig,
  onChange,
  label,
  onReset,
}: PercentageSliderProps) => {
  const {formatPercent} = useI18n()
  const {value, range} = filterConfig

  const [min, max] = range
  const r = rTo2Decimals

  const currentValue = value || range
  const _value = useMemo(() => [r(currentValue[0]), r(currentValue[1])], [r, currentValue])

  return (
    <FilterSlider
      value={_value}
      onChange={onChange}
      min={r(min)}
      max={r(max)}
      tipFormatter={formatPercent}
      step={0.01}
      {...{label, onReset}}
    />
  )
}

type TextFilterProps = {
  filterConfig: {value: ?string},
} & FilterProps

// TODO: style
export const TextFilter = ({filterConfig, onChange, label}: TextFilterProps) => {
  const {value} = filterConfig
  const [inputValue, onInputChange] = useStateWithChangingDefault(value || '')

  const debouncedOnChange = useMemo(() => _.debounce(onChange, 300), [onChange])

  // TODO: flow event
  const _onChange = useCallback(
    (e: any) => {
      debouncedOnChange(e.target.value)
      onInputChange(e.target.value)
    },
    [debouncedOnChange, onInputChange]
  )

  return (
    <TextField
      label={label}
      type="search"
      margin="normal"
      onChange={_onChange}
      value={inputValue}
    />
  )
}
