// @flow

import React, {useState, useCallback} from 'react'
import {Grid, Card, CardContent} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider, Select} from '@/components/visual'
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

export default () => {
  const {performanceContext} = usePerformanceContext()
  const [performance, setPerformance] = useState(performanceContext.performance)
  const [language, setLanguage] = useState('all')
  const [region, setRegion] = useState('all')

  const onLanguageChange = useCallback((e) => setLanguage(e.target.value))
  const onDragEnd = useCallback((e) => performanceContext.setPerformance(performance), [
    performance,
  ])

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
              onChange={setRegion}
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
