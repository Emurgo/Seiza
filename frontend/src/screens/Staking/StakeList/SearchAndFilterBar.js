// @flow
import React, {useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, ToggleButton} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import Filters from './Filters'
import {useShowFiltersContext} from '../context/showFilters'
import {useSearchTextContext} from '../context/searchText'

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

const Search = () => {
  const searchTextContext = useSearchTextContext()
  const [searchText, setSearchText] = useStateWithChangingDefault(searchTextContext.searchText)

  const onSearch = useCallback((query) => searchTextContext.setSearchText(query), [
    searchTextContext,
  ])

  const {translate: tr} = useI18n()
  return (
    <Searchbar
      placeholder={tr(messages.searchPlaceholder)}
      value={searchText}
      onChange={setSearchText}
      onSearch={onSearch}
    />
  )
}

export default () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {showFilters, toggleFilters} = useShowFiltersContext()
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
}
