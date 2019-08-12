// @flow

import _ from 'lodash'
import cn from 'classnames'
import React, {useCallback, useMemo} from 'react'
import {Grid, TextField, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {rTo2Decimals} from './helpers'

import type {SliderRange} from './types'

const messages = defineMessages({
  textFilterHint: 'Type text to search ...',
  reset: 'Reset',
})

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
  minWidth?: number,
  sliderClassName?: string,
  filterActive: boolean,
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: (props) => props.minWidth || 200,
  },
  adaSlider: {
    paddingLeft: `${theme.spacing(4)}px !important`, // Needed
    paddingRight: `${theme.spacing(4)}px !important`, // Needed
  },
  sliderWrapper: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  reset: {
    'marginTop': theme.spacing(0.5),
    'textTransform': 'uppercase',
    'cursor': 'pointer',
    'textDecoration': 'underline',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

const FilterSlider = ({
  label,
  min,
  max,
  onChange,
  value,
  tipFormatter,
  onReset,
  step,
  sliderClassName,
  filterActive,
  minWidth,
}: FilterSliderProps) => {
  const classes = useStyles({minWidth})
  const {translate: tr} = useI18n()

  const [draggingValue, onDraggingChange] = useStateWithChangingDefault(value)
  const onDragEnd = useCallback(() => onChange(draggingValue), [draggingValue, onChange])

  return (
    <div className={classes.wrapper}>
      <Grid container wrap="nowrap" justify="space-between">
        <Grid item>
          <Grid container direction="column">
            <Typography>{label}</Typography>
            <Typography variant="caption">{`${tipFormatter(value[0])} - ${tipFormatter(
              value[1]
            )}`}</Typography>
          </Grid>
        </Grid>
        {filterActive && (
          <Typography className={classes.reset} variant="caption" onClick={onReset}>
            {tr(messages.reset)}
          </Typography>
        )}
      </Grid>
      <div className={cn(classes.sliderWrapper, sliderClassName)}>
        <Slider
          value={draggingValue}
          onChange={onDraggingChange}
          {...{min, max, tipFormatter, onDragEnd, step}}
        />
      </div>
    </div>
  )
}

type FilterProps = {
  label: string,
  onChange: Function,
  onReset: Function,
  filterActive: boolean,
}

type RangeSliderProps = {
  filterConfig: {value: ?SliderRange, range: SliderRange},
} & FilterProps

export const PercentageSlider = ({
  filterConfig,
  onChange,
  label,
  onReset,
  filterActive,
}: RangeSliderProps) => {
  const {formatPercent} = useI18n()
  const {value, range} = filterConfig

  const [min, max] = range
  const r = rTo2Decimals

  const currentValue = value || range
  const _value = useMemo(() => [r(currentValue[0]), r(currentValue[1])], [r, currentValue])

  return (
    <FilterSlider
      value={_value}
      min={r(min)}
      max={r(max)}
      tipFormatter={formatPercent}
      step={0.01}
      {...{label, onChange, onReset, filterActive}}
    />
  )
}

export const AdaSlider = ({
  filterConfig,
  onChange,
  label,
  onReset,
  filterActive,
}: RangeSliderProps) => {
  const classes = useStyles()
  const {formatAdaSplit} = useI18n()
  const {value, range} = filterConfig

  const [min, max] = range
  const _value = value || range

  // TODO: with current slider it is hard to return component, as it except
  // tipFormatter to return number|string (for inner width calculations).
  // Consider updating material-ui and using their new slider.
  const tipFormatter = (v) => `${formatAdaSplit(v).integral} ADA`

  return (
    <FilterSlider
      value={_value}
      sliderClassName={classes.adaSlider}
      minWidth={320}
      {...{label, onReset, tipFormatter, min, max, onChange, filterActive}}
    />
  )
}

export const IntegerSlider = ({
  filterConfig,
  onChange,
  label,
  onReset,
  filterActive,
}: RangeSliderProps) => {
  const {value, range} = filterConfig

  const [min, max] = range
  const _value = value || range

  const tipFormatter = useCallback((v) => v, [])

  return (
    <FilterSlider
      value={_value}
      {...{label, onReset, tipFormatter, min, max, onChange, filterActive}}
    />
  )
}

type TextFilterProps = {
  filterConfig: {value: ?string},
} & FilterProps

export const TextFilter = ({filterConfig, onChange, label}: TextFilterProps) => {
  const {translate: tr} = useI18n()
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
      margin="normal"
      onChange={_onChange}
      value={inputValue}
      helperText={tr(messages.textFilterHint)}
      autoFocus
    />
  )
}
