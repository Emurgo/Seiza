// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'
import {makeStyles} from '@material-ui/styles'

import {Select} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'staking.sortByBar'

const messages = defineMessages({
  sortBy: {
    id: `${I18N_PREFIX}.sortBy`,
    defaultMessage: 'Sort by',
  },
  revenue: {
    id: `${I18N_PREFIX}.revenue`,
    defaultMessage: 'Revenue',
  },
  performance: {
    id: `${I18N_PREFIX}.performance`,
    defaultMessage: 'Performance',
  },
  fullness: {
    id: `${I18N_PREFIX}.fullness`,
    defaultMessage: 'Fullness',
  },
  pledge: {
    id: `${I18N_PREFIX}.pledge`,
    defaultMessage: 'Pledge',
  },
  margins: {
    id: `${I18N_PREFIX}.margins`,
    defaultMessage: 'Margins',
  },
  stake: {
    id: `${I18N_PREFIX}.stake`,
    defaultMessage: 'Stake',
  },
  shownPoolsCount: {
    id: `${I18N_PREFIX}.shownPoolsCount`,
    defaultMessage: '{count} Stake {count, plural, =0 {pools} one {pool} other {pools}} from',
  },
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

// TODO: Move to context
export default compose(
  withStateHandlers(
    {
      sortBy: 'revenue',
    },
    {
      setSortBy: () => (sortBy) => ({sortBy}),
    }
  ),
  withHandlers({
    onSortByChange: ({setSortBy}) => (e) => setSortBy(e.target.value),
  })
)(({sortBy, onSortByChange, totalPoolsCount, shownPoolsCount}) => {
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
            {value: 'revenue', label: tr(messages.revenue)},
            {value: 'performance', label: tr(messages.performance)},
            {value: 'fullness', label: tr(messages.fullness)},
            {value: 'pledge', label: tr(messages.pledge)},
            {value: 'margins', label: tr(messages.margins)},
            {value: 'stake', label: tr(messages.stake)},
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
