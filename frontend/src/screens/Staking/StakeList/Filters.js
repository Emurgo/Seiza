// @flow

import React from 'react'
import {Grid, Card, CardContent} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider, Select} from '@/components/visual'
import {onDidUpdate} from '@/components/HOC/lifecycles'
import {withPerformanceContext} from '../context'

const messages = defineMessages({
  allLanguages: 'All',
  languages: 'Languages',
  regions: 'Regions',
  allRegions: 'All',
  performance: 'Performance:',
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.background.paper,
  },
  select: {
    width: '85%',
  },
  slider: {
    width: '90%',
  },
}))

const RANGE_START = 0
const RANGE_END = 100

const tipFormatter = (value) => `${value}%`

type ExternalProps = {}

export default (compose(
  withPerformanceContext,
  withStateHandlers(
    (props) => ({
      performance: props.performanceContext.performance,
      language: 'all',
      region: 'all',
    }),
    {
      setRegion: () => (region) => ({region}),
      setLanguage: () => (language) => ({language}),
      setPerformance: () => (performance) => ({performance}),
    }
  ),
  withHandlers({
    onLanguageChange: ({setLanguage}) => (e) => setLanguage(e.target.value),
    onDragEnd: ({performanceContext, performance}) => () => {
      performanceContext.setPerformance(performance)
    },
  }),
  onDidUpdate((props, prevProps) => {
    if (props.performanceContext.performance !== prevProps.performanceContext.performance) {
      props.setPerformance(props.performanceContext.performance)
    }
  })
)(
  ({
    onDragEnd,
    setPerformance: onPerformanceChange,
    performance,
    onLanguageChange,
    language,
    setRegion: onRegionChange,
    region,
  }) => {
    const {translate: tr} = useI18n()
    const classes = useStyles()
    return (
      <Card>
        <CardContent>
          <Grid container className={classes.wrapper} direction="row">
            <Grid item xs={4}>
              <Select
                value={region}
                label={tr(messages.regions)}
                onChange={onRegionChange}
                className={classes.select}
                options={[{value: 'all', label: tr(messages.allRegions)}]}
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                value={language}
                label={tr(messages.languages)}
                onChange={onLanguageChange}
                className={classes.select}
                options={[{value: 'all', label: tr(messages.allLanguages)}]}
              />
            </Grid>
            <Grid item xs={4}>
              <div className={classes.slider}>
                <Slider
                  min={RANGE_START}
                  max={RANGE_END}
                  tipFormatter={tipFormatter}
                  value={performance}
                  label={tr(messages.performance)}
                  className={classes.slider}
                  onChange={onPerformanceChange}
                  onDragEnd={onDragEnd}
                />
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
): React$ComponentType<ExternalProps>)
