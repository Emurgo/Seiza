// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withStateHandlers, withHandlers} from 'recompose'
import {withRouter} from 'react-router'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, Button} from '@/components/visual'
import Filters from './Filters'

const I18N_PREFIX = 'staking.actionBar'

const messages = defineMessages({
  searchPlaceholder: {
    id: `${I18N_PREFIX}.searchBar`,
    defaultMessage: 'Search for a Stake Pool by name',
  },
  filters: {
    id: `${I18N_PREFIX}.filters`,
    defaultMessage: 'Filters',
  },
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '20px',
  },
  searchWrapper: {
    flex: 1,
    marginRight: '20px',
  },
  filtersWrapper: {
    marginTop: '20px',
  },
  button: {
    width: '100px',
  },
}))

const Search = compose(
  withRouter,
  withStateHandlers(
    {
      searchText: '',
    },
    {
      setSearchText: () => (searchText) => ({searchText}),
    }
  ),
  withHandlers({
    // TODO:
    onSearch: ({history}) => (query) => console.log('query', query), // eslint-disable-line
  })
)(({i18n, searchText, setSearchText, onChange, onSearch}) => {
  const {translate: tr} = useI18n()
  return (
    <Searchbar
      placeholder={tr(messages.searchPlaceholder)}
      value={searchText}
      onChange={setSearchText}
      onSearch={onSearch}
    />
  )
})

export default () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Grid container direction="column" justify="space-between" className={classes.wrapper}>
      <Grid item>
        <Grid container justify="space-between">
          <div className={classes.searchWrapper}>
            <Search />
          </div>
          <Button primary className={classes.button}>
            {tr(messages.filters)}
          </Button>
        </Grid>
      </Grid>
      <Grid item className={classes.filtersWrapper}>
        <Filters />
      </Grid>
    </Grid>
  )
}
