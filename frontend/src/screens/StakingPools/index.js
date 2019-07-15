// @flow
import React, {useMemo, useState, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {Typography, Grid} from '@material-ui/core'

import {Pagination, AdaValue, LoadingError} from '@/components/common'
import {SimpleLayout, LoadingInProgress} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull, getPageCount} from '@/helpers/utils'

import {ItemIdentifier} from '@/components/common/ComparisonMatrix/utils'
import {useI18n} from '@/i18n/helpers'
import StakepoolsTable from './StakepoolsTable'
import {useLoadStakepools} from './dataLoaders'

import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons'

const messages = defineMessages({
  NA: 'N/A',
  adaStaked: 'Ada staked',
  fullness: 'Fullness',
  margins: 'Margins',
  performance: 'Performance',
  rewards: 'Rewards',
  title: 'Name',
})

const ROWS_PER_PAGE = 20

const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
}

const Header = ({title, sortOptions, field, onClick}) => {
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

const fieldsConfig = [
  {
    field: 'adaStaked',
    getValue: ({data, NA}) => <AdaValue value={data.adaStaked} noValue={NA} showCurrency />,
  },
  {
    field: 'fullness',
    getValue: ({data, formatPercent}) => formatPercent(data.fullness),
  },
  {
    field: 'margins',
    getValue: ({data, formatPercent}) => formatPercent(data.margins),
  },
  {
    field: 'performance',
    getValue: ({data, formatPercent}) => formatPercent(data.performance),
  },
  {
    field: 'rewards',
    getValue: ({data, NA}) => <AdaValue value={data.rewards} noValue={NA} showCurrency />,
  },
]

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

const useGetTableData = (stakepoolsToShow, sortOptions, onSortByChange) => {
  const {formatPercent, translate: tr} = useI18n()
  const NA = tr(messages.NA)

  const tableData = useMemo(
    () =>
      stakepoolsToShow.map((data) => ({
        title: <ItemIdentifier title={data.name} identifier={data.poolHash} />,
        values: fieldsConfig.map((conf) => conf.getValue({data, formatPercent, NA})),
      })),
    [NA, formatPercent, stakepoolsToShow]
  )

  const tableHeaders = useMemo(
    () => ({
      title: (
        <Typography variant="overline" color="textSecondary">
          {tr(messages.title)}
        </Typography>
      ),
      values: fieldsConfig.map(({field}) => (
        <Header
          key={field}
          field={field}
          sortOptions={sortOptions}
          title={tr(messages[field])}
          onClick={() => onSortByChange(field)}
        />
      )),
    }),
    [onSortByChange, sortOptions, tr]
  )

  return {tableData, tableHeaders}
}

const StakingPools = () => {
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

  // TODO: add "settings" to choose properties to be displayed
  const {tableData, tableHeaders} = useGetTableData(stakepoolsToShow, sortOptions, onSortByChange)

  return (
    <SimpleLayout title="Stake Pools">
      {error || loading ? (
        error ? (
          <LoadingError error={error} />
        ) : (
          <LoadingInProgress />
        )
      ) : (
        <React.Fragment>
          <Pagination
            pageCount={getPageCount(stakepools.length, ROWS_PER_PAGE)}
            page={page}
            onChangePage={setPage}
          />
          <StakepoolsTable headers={tableHeaders} data={tableData} />
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default StakingPools
