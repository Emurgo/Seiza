// @flow
import _ from 'lodash'
import cn from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import React, {useCallback, useState, useMemo} from 'react'
import {defineMessages} from 'react-intl'
import {Grid, Collapse, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Searchbar, ToggleButton, Button, SearchbarTextField} from '@/components/visual'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {isInteger} from '@/helpers/validators'

import Filters from './Filters'
import {useSearchTextContext} from '../context/searchText'
import {usePerformanceContext} from '../context/performance'
import {useUserAdaContext} from '../context/userAda'

import {ReactComponent as CloseFilters} from '@/static/assets/icons/close-filter.svg'
import {ReactComponent as OpenFilters} from '@/static/assets/icons/filter.svg'

const messages = defineMessages({
  searchPlaceholder: 'Search for a Stake Pool by name',
  filters: 'Filters',
  userAdaToStake: 'Your ADA',
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2.5),
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  searchWrapper: {
    flex: 1,
    marginRight: '20px',
  },
  topSearchWrapper: {
    flex: 1,
    marginBottom: theme.spacing(1),
  },
  filtersWrapper: {
    marginTop: '20px',
  },
  userAdaInput: {
    width: '100%',
  },
  userAdaWrapper: {
    maxWidth: 200,
    marginRight: theme.spacing(2),
  },
}))

const useAreFiltersChanged = () => {
  const {performanceEqualsDefault} = usePerformanceContext()
  return !performanceEqualsDefault
}

const useFiltersState = () => {
  const areFiltersChanged = useAreFiltersChanged()
  const [showFilters, setShowFilters] = useState(areFiltersChanged)

  const onToggleShowFilters = useCallback(() => {
    setShowFilters(!showFilters)
  }, [showFilters])

  return {showFilters, onToggleShowFilters, setShowFilters}
}

const Search = ({onSearch}) => {
  const searchTextContext = useSearchTextContext()
  const [searchText, setSearchText] = useStateWithChangingDefault(searchTextContext.searchText)

  const _onSearch = useCallback(
    (query) => {
      searchTextContext.setSearchText(query)
      onSearch && onSearch()
    },
    [onSearch, searchTextContext]
  )

  const onReset = useCallback(() => {
    // Note: we also need to call `setSearchText` even when we use useStateWithChangingDefault
    // because it will not work when resetting `searchText` before first search was run
    // as the default state has not changed yet (is still equal ''), the useStateWithChangingDefault
    // would not case `searchText` to change
    setSearchText('')
    searchTextContext.setSearchText('')
  }, [searchTextContext, setSearchText])

  const {translate: tr} = useI18n()
  return (
    <Searchbar
      placeholder={tr(messages.searchPlaceholder)}
      value={searchText}
      onChange={setSearchText}
      onSearch={_onSearch}
      onReset={onReset}
    />
  )
}

const UserAdaInput = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {userAda, setUserAda} = useUserAdaContext()
  const [currentUserAda, setCurrentUserAda] = useStateWithChangingDefault(userAda)

  const debouncedOnChange = useMemo(() => _.debounce(setUserAda, 1000), [setUserAda])

  const onChange = useCallback(
    (e: any) => {
      // TODO: flow event
      const newValue = e.target.value
      if ((isInteger(newValue) && newValue > 0) || newValue === '') {
        debouncedOnChange(newValue)
        setCurrentUserAda(newValue)
      }
    },
    [debouncedOnChange, setCurrentUserAda]
  )

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setUserAda(currentUserAda)
    },
    [currentUserAda, setUserAda]
  )

  const onReset = useCallback(() => setUserAda(''), [setUserAda])

  return (
    <form onSubmit={onSubmit}>
      <SearchbarTextField
        value={currentUserAda}
        onChange={onChange}
        placeholder={tr(messages.userAdaToStake)}
        className={classes.userAdaInput}
        onReset={onReset}
        rounded
      />
    </form>
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
  },
  icon: {
    // Note: without position: absolute causes bugs in animation
    position: 'absolute',
    bottom: 19,
    right: 21,
  },
}))

const FiltersButton = ({open, onClick}) => {
  const classes = useFiltersButtonClasses()
  const {translate: tr} = useI18n()
  const isMobile = useIsMobile()

  return isMobile ? (
    <Button variant="contained" onClick={onClick} className={classes.mobileButton}>
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
    <ToggleButton {...{open, onClick}} variant="contained" className={classes.desktopButton}>
      {tr(messages.filters)}
    </ToggleButton>
  )
}

const CommonTopBarLayout = ({
  rightSideElem,
  onSearch,
}: {
  rightSideElem?: React$Node,
  onSearch?: Function,
}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Hidden lgUp implementation="css">
        <Grid item>
          <div className={classes.topSearchWrapper}>
            <Search onSearch={onSearch} />
          </div>
        </Grid>
        <Grid item>
          <Grid container justify="space-between" wrap="nowrap">
            <div className={classes.userAdaWrapper}>
              <UserAdaInput />
            </div>
            {rightSideElem}
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdDown>
        <Grid item>
          <Grid container justify="space-between">
            <div className={classes.userAdaWrapper}>
              <UserAdaInput />
            </div>
            <div className={cn(classes.searchWrapper, 'flex-grow-1')}>
              <Search onSearch={onSearch} />
            </div>
            {rightSideElem}
          </Grid>
        </Grid>
      </Hidden>
    </React.Fragment>
  )
}

export const SimpleStakingTopBar = () => {
  const classes = useStyles()

  return (
    <Grid container direction="column" justify="space-between" className={classes.wrapper}>
      <CommonTopBarLayout />
    </Grid>
  )
}

export const AdvancedStakingTopBar = () => {
  const classes = useStyles()
  const areFiltersChanged = useAreFiltersChanged()
  const {showFilters, onToggleShowFilters, setShowFilters} = useFiltersState()

  const onSearch = useCallback(() => areFiltersChanged && setShowFilters(true), [
    areFiltersChanged,
    setShowFilters,
  ])

  return (
    <Grid container direction="column" justify="space-between" className={classes.wrapper}>
      <CommonTopBarLayout
        onSearch={onSearch}
        rightSideElem={<FiltersButton open={showFilters} onClick={onToggleShowFilters} />}
      />
      <Collapse in={showFilters}>
        <Grid item className={classes.filtersWrapper}>
          <Filters />
        </Grid>
      </Collapse>
    </Grid>
  )
}
