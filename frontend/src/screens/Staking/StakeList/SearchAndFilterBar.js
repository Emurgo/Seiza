// @flow
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import React, {useCallback, useState} from 'react'
import {defineMessages} from 'react-intl'
import {Grid, Collapse} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, ToggleButton, Button} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

import Filters from './Filters'
import {useSearchTextContext} from '../context/searchText'
import {usePerformanceContext} from '../context/performance'

import {ReactComponent as CloseFilters} from '@/static/assets/icons/close-filter.svg'
import {ReactComponent as OpenFilters} from '@/static/assets/icons/filter.svg'

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
}))

const useAreFiltersChanged = () => {
  const {performanceEqualsDefault} = usePerformanceContext()
  return !performanceEqualsDefault
}

const useToggleFilters = () => {
  const areFiltersChanged = useAreFiltersChanged()
  const [showFilters, setShowFilters] = useState(areFiltersChanged)

  const onToggleShowFilters = useCallback(() => {
    setShowFilters(!showFilters)
  }, [showFilters])

  return [showFilters, onToggleShowFilters]
}

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

const useFiltersButtonClasses = makeStyles((theme) => ({
  enter: {
    opacity: 0,
  },
  enterActive: {
    opacity: 1,
    transition: 'opacity 300ms 200ms',
  },
  leave: {
    opacity: 1,
  },
  leaveActive: {
    opacity: 0,
    transition: 'opacity 300ms',
  },
  desktopButton: {
    width: '120px',
  },
  mobileButton: {
    position: 'relative',
    // Note: keep in sync with searchbar height
    // TODO: consider exporting/importing
    height: 58,
  },
  icon: {
    position: 'absolute',
    // TODO: can we center both icons without absolute/top/left?
    top: 18,
    left: 22,
  },
}))

const FiltersButton = ({open, onClick}) => {
  const classes = useFiltersButtonClasses()
  const {translate: tr} = useI18n()
  const isMobile = useIsMobile()

  return isMobile ? (
    <Button onClick={onClick} secondary className={classes.mobileButton}>
      <ReactCSSTransitionGroup
        transitionName={{
          enter: classes.enter,
          enterActive: classes.enterActive,
          leave: classes.leave,
          leaveActive: classes.leaveActive,
        }}
        transitionLeave
        transitionLeaveTimeout={300}
        transitionEnter
        transitionEnterTimeout={500}
        transitionAppear={false}
        component="div"
      >
        {open ? (
          <CloseFilters key="opened" className={classes.icon} />
        ) : (
          <OpenFilters key="close" className={classes.icon} />
        )}
      </ReactCSSTransitionGroup>
    </Button>
  ) : (
    <ToggleButton {...{open, onClick}} secondary className={classes.desktopButton}>
      {tr(messages.filters)}
    </ToggleButton>
  )
}

export default () => {
  const classes = useStyles()
  const [showFilters, onToggleShowFilters] = useToggleFilters()

  return (
    <Grid container direction="column" justify="space-between" className={classes.wrapper}>
      <Grid item>
        <Grid container justify="space-between">
          <div className={classes.searchWrapper}>
            <Search />
          </div>
          <FiltersButton open={showFilters} onClick={onToggleShowFilters} />
        </Grid>
      </Grid>
      <Collapse in={showFilters}>
        <Grid item className={classes.filtersWrapper}>
          <Filters />
        </Grid>
      </Collapse>
    </Grid>
  )
}
