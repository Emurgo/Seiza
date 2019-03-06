// @flow

import React from 'react'
import {Grid, Card, CardContent, withStyles} from '@material-ui/core'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'

import {Slider, Select} from '@/components/visual'

const styles = (theme) => ({
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
})

const RANGE_START = 0
const RANGE_END = 100

const tipFormatter = (value) => `${value}%`

// TODO: intl
// Note: just mocked usage demonstration
export default compose(
  withStyles(styles),
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
)(({classes, setRange: onRangeChange, range, onLanguageChange, language}) => (
  <Card>
    <CardContent>
      <Grid container className={classes.wrapper} direction="row">
        <Grid item>
          <Select
            value={language}
            label="Languages"
            onChange={onLanguageChange}
            className={classes.select}
            options={[{value: 'en', label: 'En'}, {value: 'es', label: 'Es'}]}
          />
        </Grid>
        <Grid item>
          <Slider
            min={RANGE_START}
            max={RANGE_END}
            tipFormatter={tipFormatter}
            value={range}
            label="Performance"
            className={classes.slider}
            onChange={onRangeChange}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
))
