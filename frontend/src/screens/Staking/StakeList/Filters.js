// @flow

import React, {useState, useCallback} from 'react'
import {Grid, Switch, FormControlLabel, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider, Select, Card, ContentSpacing} from '@/components/visual'
import {HelpTooltip} from '@/components/common'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {usePerformanceContext} from '../context/performance'
import {useExactMatchContext} from '../context/exactMatch'

const messages = defineMessages({
  allLanguages: 'All',
  languages: 'Languages',
  regions: 'Regions',
  allRegions: 'All',
  performance: 'Performance:',
  equalResult: 'Equal Result:',
  equalResultHelpText: 'TODO: equal result help text',
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.background.paper,
  },
  // We need these corrections because both select
  // has formControl below which adds its own margins
  select: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  slider: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: theme.spacing(1),
  },
  equalResultWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}))

const RANGE_START = 0
const RANGE_END = 100

const tipFormatter = (value) => `${value}%`

const EqualResult = () => {
  const {translate: tr} = useI18n()
  const {exactMatch, toggleExactMatch} = useExactMatchContext()
  return (
    <FormControlLabel
      control={<Switch color="primary" checked={!!exactMatch} onChange={toggleExactMatch} />}
      label={
        <HelpTooltip text={tr(messages.equalResultHelpText)}>
          <Typography color="textSecondary" className="uppercase">
            {tr(messages.equalResult)}
          </Typography>
        </HelpTooltip>
      }
      labelPlacement="start"
    />
  )
}

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
      <ContentSpacing top={0.5} left={0.5} bottom={0.5} right={0.5}>
        <Grid container className={classes.wrapper} direction="row">
          <Grid item xs={12} sm={6}>
            <Select
              value={region}
              label={tr(messages.regions)}
              onChange={onRegionChange}
              className={classes.select}
              options={[{value: 'all', label: tr(messages.allRegions)}]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              value={language}
              label={tr(messages.languages)}
              onChange={onLanguageChange}
              className={classes.select}
              options={[{value: 'all', label: tr(messages.allLanguages)}]}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.equalResultWrapper}>
            <EqualResult />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>
      </ContentSpacing>
    </Card>
  )
}

export default Filters
