// @flow
import React, {useMemo} from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'

import {Pagination, AdaValue} from '@/components/common'
import {SimpleLayout} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull, getPageCount} from '@/helpers/utils'

import {ItemIdentifier} from '@/components/common/ComparisonMatrix/utils'
import {useI18n} from '@/i18n/helpers'
import StakePoolsTable from './StakePoolsTable'
import {useLoadStakePools} from './dataLoaders'

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

const Header = ({title}) => (
  <Typography variant="overline" color="textSecondary">
    {title}
  </Typography>
)

const StakingPools = () => {
  const {stakePools, loading, error} = useLoadStakePools()
  const {formatPercent, translate: tr} = useI18n()
  const [page, setPage] = useManageQueryValue('page', 1, toIntOrNull)

  const NA = tr(messages.NA)

  const stakePoolsToShow = useMemo(
    () => stakePools.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [page, stakePools]
  )

  // TODO: add "settings" to choose properties to be displayed
  const tableData = useMemo(
    () =>
      stakePoolsToShow.map((d) => ({
        title: <ItemIdentifier title={d.name} identifier={d.poolHash} />,
        values: [
          <AdaValue key="adaStaked" value={d.summary.adaStaked} noValue={NA} showCurrency />,
          formatPercent(d.summary.fullness),
          formatPercent(d.summary.margins),
          formatPercent(d.summary.performance),
          <AdaValue key="rewards" value={d.summary.rewards} noValue={NA} showCurrency />,
        ],
      })),
    [NA, formatPercent, stakePoolsToShow]
  )

  const tableHeaders = useMemo(
    () => ({
      title: (
        <Typography variant="overline" color="textSecondary">
          {tr(messages.title)}
        </Typography>
      ),
      values: [
        <Header key="adaStaked" title={tr(messages.adaStaked)} />,
        <Header key="fullness" title={tr(messages.fullness)} />,
        <Header key="margins" title={tr(messages.margins)} />,
        <Header key="performance" title={tr(messages.performance)} />,
        <Header key="rewards" title={tr(messages.rewards)} />,
      ],
    }),
    [tr]
  )

  if (loading) {
    // TODO: do something
  }

  if (error) {
    // TODO: do something
  }

  return (
    <SimpleLayout title="Stake Pools">
      <Pagination
        pageCount={getPageCount(stakePools.length, ROWS_PER_PAGE)}
        page={page}
        onChangePage={setPage}
      />
      <StakePoolsTable headers={tableHeaders} data={tableData} />
    </SimpleLayout>
  )
}

export default StakingPools
