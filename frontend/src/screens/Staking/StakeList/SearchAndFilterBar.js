// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withHandlers, withStateHandlers} from 'recompose'
import {withRouter} from 'react-router'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, Button} from '@/components/visual'
import {onDidUpdate} from '@/components/HOC/lifecycles'
import Filters from './Filters'
import {withShowFiltersContext, withSearchByContext} from '../context'

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

// TODO: consider adding `onClear` handler to `Searchbar` and re-query then
const Search = compose(
  withRouter,
  withSearchByContext,
  withStateHandlers((props) => ({searchBy: props.searchByContext.searchBy}), {
    setSearchBy: () => (searchBy) => ({searchBy}),
  }),
  onDidUpdate((props, prevProps) => {
    if (props.searchByContext.searchBy !== prevProps.searchByContext.searchBy) {
      props.setSearchBy(props.searchByContext.searchBy)
    }
  }),
  withHandlers({
    onSearch: ({searchByContext}) => (query) => searchByContext.setSearchBy(query),
  })
)(({i18n, setSearchBy: onChange, searchBy: value, onSearch}) => {
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
          <Button onClick={toggleFilters} primary className={classes.button}>
            {tr(messages.filters)}
          </Button>
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
