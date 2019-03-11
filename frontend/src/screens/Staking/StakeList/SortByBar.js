// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {withHandlers} from 'recompose'
import {compose} from 'redux'
import {makeStyles} from '@material-ui/styles'

import {Select} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {withSortByContext} from '../context'
import {SORT_BY_OPTIONS} from '../context/sortBy'

const I18N_PREFIX = 'staking.sortByBar'

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

export default compose(
  withSortByContext,
  withHandlers({
    onSortByChange: ({sortByContext: {setSortBy}}) => (e) => setSortBy(e.target.value),
  })
)(({sortByContext: {sortBy}, onSortByChange, totalPoolsCount, shownPoolsCount}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
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
})
