// @flow
import _ from 'lodash'
import cn from 'classnames'
import React, {useMemo, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Pagination, LoadingError} from '@/components/common'
import {
  SimpleLayout,
  LoadingInProgress,
  Select,
  Button,
  MobileOnly,
  DesktopOnly,
} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import {useI18n} from '@/i18n/helpers'

import StakepoolsTable from './StakepoolsTable'
import Header from './Header'
import {useLoadStakepools} from './dataLoaders'
import {fieldsConfigMap, nonTitleFieldsConfig} from './fieldsConfig'
import {useFilters, useFilteredPools, FiltersProvider} from './filtersUtils'
import ColumnHeader from './ColumnHeader'
import {useSortOptions, SortOptionsProvider} from './sortUtils'
import {useSelectedFieldsProps} from './selectedFieldsUtils'
import {ScrollableWrapperRefProvider, useScrollableWrapperRef} from './scrollableWrapperUtils'

const messages = defineMessages({
  NA: 'N/A',
  title: 'Name',
  screenTitle: 'Stake Pools',
  manageColumns: 'Manage columns',
  noColumns: 'Please select some columns.',
  resetAllFilters: 'Reset all filters',
  resetAllFiltersMobile: 'Reset filters',
  noResults: 'No data matching filters',
  noData: 'No pools to show',
})

const ROWS_PER_PAGE = 20

const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: 100,
      paddingLeft: 100,
    },
    marginBottom: 0,
  },
  resetAll: {
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(0.9),
    paddingBottom: theme.spacing(0.9),
  },
  fieldsSelect: {
    marginLeft: 0,
    maxWidth: 160,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '100%',
    },
  },
  resetAllText: {
    'paddingLeft': theme.spacing(2),
    'textDecoration': 'underline',
    'cursor': 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  controls: {
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
  },
  upperPagination: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      padding: 0,
    },
  },
  bottomPaginationWrapper: {
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
}))

const useGetTableData = (selectedFields, stakepoolsToShow) => {
  const _fieldsConfig = useMemo(
    () => nonTitleFieldsConfig.filter((conf) => selectedFields.includes(conf.field)),
    [selectedFields]
  )

  const {formatPercent, formatTimestamp, formatInt, translate: tr} = useI18n()
  const NA = tr(messages.NA)

  const tableData = useMemo(
    () =>
      stakepoolsToShow.map((data) => ({
        title: fieldsConfigMap.name.getValue({data}),
        values: _fieldsConfig.map((conf) =>
          conf.getValue({data, formatPercent, NA, formatTimestamp, formatInt})
        ),
      })),
    [NA, _fieldsConfig, formatInt, formatPercent, formatTimestamp, stakepoolsToShow]
  )

  const tableHeaders = useMemo(
    () => ({
      title: <ColumnHeader field="name" />,
      values: _fieldsConfig.map(({field, getLabel}) => <ColumnHeader key={field} field={field} />),
    }),
    [_fieldsConfig]
  )

  const options = useMemo(
    () =>
      _fieldsConfig.map((field) => ({
        align: field.align,
      })),
    [_fieldsConfig]
  )

  return {tableData, tableHeaders, options}
}

const useGetSortedPools = (stakepools) => {
  const {filters} = useFilters()
  const filteredPools = useFilteredPools(stakepools, filters)

  const {sortOptions} = useSortOptions()
  const sortedPools = useMemo(
    () => _.orderBy(filteredPools, (d) => d[sortOptions.field], [sortOptions.order]),
    [filteredPools, sortOptions.field, sortOptions.order]
  )

  return sortedPools
}

type StakingPoolsProps = {|
  setPage: Function,
  page: number,
  stakepools: Array<{}>, // TODO: get type for stakepool once we have proper schema
|}

export const StakingPools = (props: StakingPoolsProps) => (
  <ScrollableWrapperRefProvider>
    <_StakingPools {...props} />
  </ScrollableWrapperRefProvider>
)

const _StakingPools = ({setPage, page, stakepools}: StakingPoolsProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  const {resetFilters, filters} = useFilters()
  const sortedPools = useGetSortedPools(stakepools)

  const filtersDisabled = useMemo(
    () =>
      Object.entries(filters).every(([field, fConf]) => {
        return !fieldsConfigMap[field].filter.isFilterActive(fConf)
      }),
    [filters]
  )

  const stakepoolsToShow = useMemo(
    () => sortedPools.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [page, sortedPools]
  )

  const {
    selectedFields,
    onSelectedFieldsChange,
    selectOptions,
    renderSelectValue,
  } = useSelectedFieldsProps()

  const {scrollableWrapperRef, scrollableWrapperNode} = useScrollableWrapperRef()

  const {tableData, tableHeaders, options} = useGetTableData(selectedFields, stakepoolsToShow)

  if (!stakepools.length) {
    return <Typography variant="overline">{tr(messages.noData)}</Typography>
  }

  const pagination = (
    <Pagination
      pageCount={getPageCount(sortedPools.length, ROWS_PER_PAGE)}
      page={page}
      onChangePage={setPage}
    />
  )

  return (
    <React.Fragment>
      <Grid container className={cn(classes.wrapper, classes.controls)}>
        <Grid item>
          <Grid container alignItems="flex-end">
            <Select
              multiple
              value={selectedFields}
              onChange={onSelectedFieldsChange}
              options={selectOptions}
              label={tr(messages.manageColumns)}
              renderValue={renderSelectValue}
              className={classes.fieldsSelect}
            />
            <Button
              variant="outlined"
              className={classes.resetAll}
              disabled={filtersDisabled}
              onClick={resetFilters}
            >
              <DesktopOnly>{tr(messages.resetAllFilters)}</DesktopOnly>
              <MobileOnly>{tr(messages.resetAllFiltersMobile)}</MobileOnly>
            </Button>
          </Grid>
        </Grid>

        <Grid item className={classes.upperPagination}>
          {pagination}
        </Grid>
      </Grid>
      <StakepoolsTable
        headers={tableHeaders}
        data={tableData}
        noColumnsMsg={tr(messages.noColumns)}
        scrollRef={scrollableWrapperRef}
        scrollNode={scrollableWrapperNode}
        options={options}
      />
      {tableData.length === 0 ? (
        <div className={classes.wrapper}>
          <Typography component="span" variant="overline">
            {tr(messages.noResults)}
          </Typography>
          <Typography
            component="span"
            variant="overline"
            onClick={resetFilters}
            className={classes.resetAllText}
          >
            {tr(messages.resetAllFilters)}
          </Typography>
        </div>
      ) : (
        <Grid container className={cn(classes.wrapper, classes.bottomPaginationWrapper)}>
          <Grid item>{pagination}</Grid>
        </Grid>
      )}
    </React.Fragment>
  )
}

// TODO: better flow in all files within StakingPools folder
export default () => {
  const {translate: tr} = useI18n()

  const {stakepools, loading, error} = useLoadStakepools()
  const [page, setPage] = useManageQueryValue('page', 1, toIntOrNull)

  // Note: we also reset page when sortBy/filter changes
  const resetPage = useCallback(() => setPage(1), [setPage])
  const onSortByChange = resetPage
  const onFilterChange = resetPage

  return (
    <React.Fragment>
      <Header />
      <SimpleLayout title={tr(messages.screenTitle)}>
        {error || loading ? (
          error ? (
            <LoadingError error={error} />
          ) : (
            <LoadingInProgress />
          )
        ) : (
          <SortOptionsProvider onChange={onSortByChange}>
            <FiltersProvider allPools={stakepools} onChange={onFilterChange}>
              <StakingPools {...{page, setPage, stakepools}} />
            </FiltersProvider>
          </SortOptionsProvider>
        )}
      </SimpleLayout>
    </React.Fragment>
  )
}
