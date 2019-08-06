// @flow
import React, {useMemo, useState, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons'

import {Pagination, LoadingError} from '@/components/common'
import {SimpleLayout, LoadingInProgress, Select} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {ItemIdentifier} from '@/components/common/ComparisonMatrix/utils'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import {useI18n} from '@/i18n/helpers'

import StakepoolsTable from './StakepoolsTable'
import Header from './Header'
import {useLoadStakepools} from './dataLoaders'
import {fieldsConfig} from './fieldsConfig'

const messages = defineMessages({
  NA: 'N/A',
  title: 'Name',
  screenTitle: 'Stake Pools',
  manageColumns: 'Manage columns',
  noColumns: 'Please select some columns.',
  showAll: 'Show all',
  addressCount: 'Show {count, plural, =0 {# columns} one {# column} other {# columns}}',
})

const ROWS_PER_PAGE = 20

const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    paddingRight: 90,
    paddingLeft: 90,
  },
}))

const ColumnHeader = ({title, sortOptions, field, onClick}) => {
  const active = field === sortOptions.field
  return (
    <Grid container alignItems="center" onClick={onClick}>
      <Typography variant="overline" color={active ? 'textPrimary' : 'textSecondary'}>
        {title}
      </Typography>
      {active ? (
        sortOptions.order === ORDER.DESC ? (
          <ArrowDropDown />
        ) : (
          <ArrowDropUp />
        )
      ) : (
        <ArrowDropDown color="disabled" />
      )}
    </Grid>
  )
}

const useSortOptions = () => {
  const [sortOptions, setSortOptions] = useState({field: fieldsConfig[0].field, order: ORDER.DESC})

  const updateSortBy = useCallback(
    (field) => {
      setSortOptions({
        field,
        order:
          sortOptions.field === field
            ? sortOptions.order === ORDER.DESC
              ? ORDER.ASC
              : ORDER.DESC
            : ORDER.DESC,
      })
    },
    [sortOptions.order, sortOptions.field]
  )

  return {sortOptions, updateSortBy}
}

const useGetTableData = (selectedFields, stakepoolsToShow, sortOptions, onSortByChange) => {
  const _fieldsConfig = useMemo(
    () => fieldsConfig.filter((conf) => selectedFields.includes(conf.field)),
    [selectedFields]
  )

  const {formatPercent, formatTimestamp, formatInt, translate: tr} = useI18n()
  const NA = tr(messages.NA)

  const tableData = useMemo(
    () =>
      stakepoolsToShow.map((data) => ({
        title: <ItemIdentifier title={data.name} identifier={data.poolHash} />,
        values: _fieldsConfig.map((conf) =>
          conf.getValue({data, formatPercent, NA, formatTimestamp, formatInt})
        ),
      })),
    [NA, _fieldsConfig, formatInt, formatPercent, formatTimestamp, stakepoolsToShow]
  )

  const tableHeaders = useMemo(
    () => ({
      title: (
        <Typography variant="overline" color="textSecondary">
          {tr(messages.title)}
        </Typography>
      ),
      values: _fieldsConfig.map(({field, getLabel}) => (
        <ColumnHeader
          key={field}
          field={field}
          sortOptions={sortOptions}
          title={getLabel({tr})}
          onClick={() => onSortByChange(field)}
        />
      )),
    }),
    [_fieldsConfig, onSortByChange, sortOptions, tr]
  )

  return {tableData, tableHeaders}
}

const defaultFieldsValues = fieldsConfig.map(({field}) => field)

const useSelectProps = () => {
  const {translate: tr} = useI18n()
  const selectOptions = useMemo(
    () => fieldsConfig.map((conf) => ({label: conf.getLabel({tr}), value: conf.field})),
    [tr]
  )

  // TODO: store in cookie that is set only for `staking-pools` url
  const [selectedFields, setSelectedFields] = useState(defaultFieldsValues)

  const onSelectedFieldsChange = useCallback((e) => setSelectedFields(e.target.value), [
    setSelectedFields,
  ])

  const renderSelectValue = useCallback(
    (selected) => {
      return selected.length === selectOptions.length
        ? tr(messages.showAll)
        : tr(messages.addressCount, {count: selected.length})
    },
    [selectOptions.length, tr]
  )

  return {selectedFields, onSelectedFieldsChange, selectOptions, renderSelectValue}
}

const StakingPools = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  const [page, setPage] = useManageQueryValue('page', 1, toIntOrNull)
  const {sortOptions, updateSortBy} = useSortOptions()

  const onSortByChange = useCallback(
    (...args) => {
      updateSortBy(...args)
      setPage(1) // Note: we reset page after changing sortBy
    },
    [setPage, updateSortBy]
  )

  const {stakepools, loading, error} = useLoadStakepools(sortOptions.field, sortOptions.order)

  const stakepoolsToShow = useMemo(
    () => stakepools.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [page, stakepools]
  )

  const {
    selectedFields,
    onSelectedFieldsChange,
    selectOptions,
    renderSelectValue,
  } = useSelectProps()

  const {tableData, tableHeaders} = useGetTableData(
    selectedFields,
    stakepoolsToShow,
    sortOptions,
    onSortByChange
  )

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
          <React.Fragment>
            <Grid container justify="space-between" className={classes.wrapper}>
              <Grid item>
                <Select
                  multiple
                  value={selectedFields}
                  onChange={onSelectedFieldsChange}
                  options={selectOptions}
                  label={tr(messages.manageColumns)}
                  renderValue={renderSelectValue}
                />
              </Grid>

              <Grid item>
                <Pagination
                  pageCount={getPageCount(stakepools.length, ROWS_PER_PAGE)}
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
        )}
      </SimpleLayout>
    </React.Fragment>
  )
}

export default StakingPools
