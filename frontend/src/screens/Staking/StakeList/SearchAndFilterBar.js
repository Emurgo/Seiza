// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withHandlers, withStateHandlers} from 'recompose'
import {withRouter} from 'react-router'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, ToggleButton} from '@/components/visual'
import {onDidUpdate} from '@/components/HOC/lifecycles'
import Filters from './Filters'
import {withShowFiltersContext, withSearchTextContext} from '../context'

const messages = defineMessages({
  searchPlaceholder: 'Search for a Stake Pool by name',
  filters: 'Filters',
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
    width: '120px',
  },
}))

// TODO: consider adding `onClear` handler to `Searchbar` and re-query then
const Search = compose(
  withRouter,
  withSearchTextContext,
  withStateHandlers((props) => ({searchText: props.searchTextContext.searchText}), {
    setSearchText: () => (searchText) => ({searchText}),
  }),
  onDidUpdate((props, prevProps) => {
    if (props.searchTextContext.searchText !== prevProps.searchTextContext.searchText) {
      props.setSearchText(props.searchTextContext.searchText)
    }
  }),
  withHandlers({
    onSearch: ({searchTextContext}) => (query) => searchTextContext.setSearchText(query),
  })
)(({i18n, setSearchText: onChange, searchText: value, onSearch}) => {
  const {translate: tr} = useI18n()
  return (
    <Searchbar
      placeholder={tr(messages.searchPlaceholder)}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
    />
  )
})

export default compose(withShowFiltersContext)((props) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {
    showFiltersContext: {showFilters, toggleFilters},
  } = props
  return (
    <Grid container direction="column" justify="space-between" className={classes.wrapper}>
      <Grid item>
        <Grid container justify="space-between">
          <div className={classes.searchWrapper}>
            <Search />
          </div>
          <ToggleButton
            open={!showFilters}
            onClick={toggleFilters}
            primary
            className={classes.button}
          >
            {tr(messages.filters)}
          </ToggleButton>
        </Grid>
      </Grid>
      {showFilters && (
        <Grid item className={classes.filtersWrapper}>
          <Filters />
        </Grid>
      )}
    </Grid>
  )
})
