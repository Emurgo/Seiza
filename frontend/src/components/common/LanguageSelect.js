// @flow

import React from 'react'
import {compose} from 'redux'
import {withStyles} from '@material-ui/core'

import {withSetLocale} from '@/components/HOC/intl'
import {Select} from '@/components/visual'

const styles = (theme) => ({
  select: {
    marginRight: '40px',
    width: '80px',
  },
})

const LANGUAGES = [
  {locale: 'en', label: 'En'},
  {locale: 'ja', label: 'インポ'},
  {locale: 'ru', label: 'Russian'},
].map(({locale, label}) => ({value: locale, label}))

// TODO: use images instead of names
export default compose(
  withStyles(styles),
  withSetLocale
)(({setLocale, locale, classes}) => (
  <Select
    className={classes.select}
    value={locale}
    onChange={(e) => setLocale(e.target.value)}
    options={LANGUAGES}
  />
))
