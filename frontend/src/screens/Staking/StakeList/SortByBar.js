// @flow

import React, {useCallback} from 'react'
import {Grid, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {Select} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {SORT_BY_OPTIONS, useSortByContext} from '../context/sortBy'

const messages = defineMessages({
  sortBy: 'Sort by',
  revenue: 'Revenue',
  performance: 'Performance',
  fullness: 'Fullness',
  pledge: 'Pledge',
  margins: 'Margins',
  stake: 'Stake',
  shownPoolsCount: '{count} Stake {count, plural, =0 {pools} one {pool} other {pools}} from',
})

// TODO: margin/padding theme unit
const useStyles = makeStyles((theme) => ({
  select: {
    width: '200px',
    marginLeft: 0,
  },
  shownPools: {
    opacity: theme.typography.opaqueText.opacity,
  },
}))

type Props = {|
  totalPoolsCount: number,
  shownPoolsCount: number,
|}

const SortByBar = ({totalPoolsCount, shownPoolsCount}: Props) => {
  const {
    sortByContext: {sortBy, setSortBy},
  } = useSortByContext()
  const {translate: tr} = useI18n()
  const classes = useStyles()

  const onSortByChange = useCallback(
    (e) => {
      setSortBy(e.target.value)
    },
    [setSortBy]
  )

  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item>
        <Select
          value={sortBy}
          label={tr(messages.sortBy)}
          onChange={onSortByChange}
          className={classes.select}
          options={[
            {value: SORT_BY_OPTIONS.REVENUE, label: tr(messages.revenue)},
            {value: SORT_BY_OPTIONS.PERFORMANCE, label: tr(messages.performance)},
            {value: SORT_BY_OPTIONS.FULLNESS, label: tr(messages.fullness)},
            {value: SORT_BY_OPTIONS.PLEDGE, label: tr(messages.pledge)},
            {value: SORT_BY_OPTIONS.MARGINS, label: tr(messages.margins)},
            {value: SORT_BY_OPTIONS.STAKE, label: tr(messages.stake)},
          ]}
        />
      </Grid>
      <Grid item>
        <Grid container>
          <Typography className={classes.shownPools}>
            {tr(messages.shownPoolsCount, {count: shownPoolsCount})}
          </Typography>
          &nbsp;
          <Typography>{totalPoolsCount}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SortByBar
