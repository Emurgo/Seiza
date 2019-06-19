// @flow

import React, {useState, useCallback} from 'react'
import {Grid, Card, CardContent} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider, Select} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {usePerformanceContext} from '../context/performance'

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
  // We need these corrections because both select
  // and slider have formControl below them which
  // adds its own margins
  select: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
  },
  slider: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
  },
}))

const RANGE_START = 0
const RANGE_END = 100

const tipFormatter = (value) => `${value}%`

const Filters = () => {
  const performanceContext = usePerformanceContext()
  const [performance, setPerformance] = useStateWithChangingDefault(performanceContext.performance)
  const [language, setLanguage] = useState('all')
  const [region, setRegion] = useState('all')

  const onLanguageChange = useCallback((e) => setLanguage(e.target.value), [setLanguage])
  const onRegionChange = useCallback((e) => setRegion(e.target.value), [setRegion])
  const onDragEnd = useCallback((e) => performanceContext.setPerformance(performance), [
    performanceContext,
    performance,
  ])

  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <Card>
      <CardContent>
        <Grid container className={classes.wrapper} direction="row">
          <Grid item xs={12} sm={4}>
            <Select
              value={region}
              label={tr(messages.regions)}
              onChange={onRegionChange}
              className={classes.select}
              options={[{value: 'all', label: tr(messages.allRegions)}]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              value={language}
              label={tr(messages.languages)}
              onChange={onLanguageChange}
              className={classes.select}
              options={[{value: 'all', label: tr(messages.allLanguages)}]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className={classes.slider}>
              <Slider
                min={RANGE_START}
                max={RANGE_END}
                tipFormatter={tipFormatter}
                value={performance}
                label={tr(messages.performance)}
                className={classes.slider}
                onChange={setPerformance}
                onDragEnd={onDragEnd}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Filters
