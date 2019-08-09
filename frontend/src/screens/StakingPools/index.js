// @flow
import _ from 'lodash'
import React, {useMemo, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Pagination, LoadingError} from '@/components/common'
import {SimpleLayout, LoadingInProgress, Select, Button} from '@/components/visual'
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

const messages = defineMessages({
  NA: 'N/A',
  title: 'Name',
  screenTitle: 'Stake Pools',
  manageColumns: 'Manage columns',
  noColumns: 'Please select some columns.',
  resetAllFilters: 'Reset all filters',
})

const ROWS_PER_PAGE = 20

const useStyles = makeStyles((theme) => ({
  wrapper: {
    paddingRight: 100,
    paddingLeft: 100,
    marginBottom: 0,
  },
  resetAll: {
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(0.9),
    paddingBottom: theme.spacing(0.9),
  },
  fieldsSelect: {
    marginLeft: 0,
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

  return {tableData, tableHeaders}
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

export const StakingPools = ({setPage, page, stakepools}: StakingPoolsProps) => {
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

  const {tableData, tableHeaders} = useGetTableData(selectedFields, stakepoolsToShow)

  return (
    <React.Fragment>
      <Grid container justify="space-between" className={classes.wrapper} alignItems="flex-end">
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
              {tr(messages.resetAllFilters)}
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <Pagination
            pageCount={getPageCount(sortedPools.length, ROWS_PER_PAGE)}
            page={page}
            onChangePage={setPage}
          />
        </Grid>
      </Grid>
      <StakepoolsTable
        headers={tableHeaders}
        data={tableData}
        noColumnsMsg={tr(messages.noColumns)}
      />
    </React.Fragment>
  )
}

// TODO: better flow in all files within StakingPools folder
export default () => {
  const {translate: tr} = useI18n()

  const {stakepools, loading, error} = useLoadStakepools()
  const [page, setPage] = useManageQueryValue('page', 1, toIntOrNull)

  // Note: we also reset page when sortBy changes
  const onSortByChange = useCallback(() => setPage(1), [setPage])

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
            <FiltersProvider allPools={stakepools}>
              <StakingPools {...{page, setPage, stakepools}} />
            </FiltersProvider>
          </SortOptionsProvider>
        )}
      </SimpleLayout>
    </React.Fragment>
  )
}
