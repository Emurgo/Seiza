// @flow

import React from 'react'
import {Grid, Card, CardContent} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Slider, Select} from '@/components/visual'

const I18N_PREFIX = 'staking.filters'

const messages = defineMessages({
  allLanguages: {
    id: `${I18N_PREFIX}.allLanguages`,
    defaultMessage: 'All',
  },
  languages: {
    id: `${I18N_PREFIX}.languages`,
    defaultMessage: 'Languages',
  },
  performance: {
    id: `${I18N_PREFIX}.performance`,
    defaultMessage: 'Performance',
  },
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.background.paper,
  },
  select: {
    width: '200px',
  },
  slider: {
    width: '300px',
    marginLeft: '30px',
  },
}))

const RANGE_START = 0
const RANGE_END = 100

const tipFormatter = (value) => `${value}%`

// Note: just mocked usage demonstration
export default compose(
  withStateHandlers(
    {
      language: 'en',
      range: [RANGE_START, RANGE_END],
    },
    {
      setLanguage: () => (language) => ({language}),
      setRange: () => (range) => ({range}),
    }
  ),
  withHandlers({
    onLanguageChange: ({setLanguage}) => (e) => setLanguage(e.target.value),
  })
)(({setRange: onRangeChange, range, onLanguageChange, language}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <Card>
      <CardContent>
        <Grid container className={classes.wrapper} direction="row">
          <Grid item>
            <Select
              value={language}
              label={tr(messages.languages)}
              onChange={onLanguageChange}
              className={classes.select}
              options={[{value: 'all', label: tr(messages.allLanguages)}]}
            />
          </Grid>
          <Grid item>
            <Slider
              min={RANGE_START}
              max={RANGE_END}
              tipFormatter={tipFormatter}
              value={range}
              label={tr(messages.performance)}
              className={classes.slider}
              onChange={onRangeChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
})
