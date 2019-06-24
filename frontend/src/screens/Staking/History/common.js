// @flow

import React from 'react'
import _ from 'lodash'
import {Grid, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'

export const PROPERTIES = {
  MARGIN_CHANGED: 'marginChanged',
  COST_CHANGED: 'costChanged',
  POOL_CREATED: 'poolCreated',
  POOL_RETIRED: 'poolRetired',
}

const messages = defineMessages({
  costChanged: 'Cost changed',
  marginChanged: 'Margin changed',
  poolCreated: 'Pool created',
  poolRetired: 'Pool retired',
})

export const PROPERTIES_VALUES = _.values(PROPERTIES)

type CommonRendererProps = {|
  label: string,
  value: string,
|}

const CommonRenderer = ({label, value}: CommonRendererProps) => (
  <Grid container justify="space-between">
    <Grid item>
      <Typography>{label}</Typography>
    </Grid>
    <Grid item>
      <Typography>{value}</Typography>
    </Grid>
  </Grid>
)

type RendererProps = {|
  value: string,
|}

const MarginChangedRenderer = ({value}: RendererProps) => {
  const {translate: tr} = useI18n()
  return <CommonRenderer value={value} label={tr(messages.marginChanged)} />
}

const CostChangedRenderer = ({value}: RendererProps) => {
  const {translate: tr} = useI18n()
  return <CommonRenderer value={value} label={tr(messages.costChanged)} />
}

const PoolCreatedRenderer = ({value}: RendererProps) => {
  const {translate: tr} = useI18n()
  return <CommonRenderer value={value} label={tr(messages.poolCreated)} />
}

const PoolRetiredRenderer = ({value}: RendererProps) => {
  const {translate: tr} = useI18n()
  return <CommonRenderer value={value} label={tr(messages.poolRetired)} />
}

export const POOL_ACTION_RENDERERS = {
  [PROPERTIES.MARGIN_CHANGED]: MarginChangedRenderer,
  [PROPERTIES.COST_CHANGED]: CostChangedRenderer,
  [PROPERTIES.POOL_CREATED]: PoolCreatedRenderer,
  [PROPERTIES.POOL_RETIRED]: PoolRetiredRenderer,
}
