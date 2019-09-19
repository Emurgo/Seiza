// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {DefaultNonClickableHeaderCard, ScrollableCardsWrapper} from '@/components/common'

// Note: (richard) For now same as Header component for StakingCenter.
// I did not want to reuse StakingCenter Header or make it too generic as I assume the
// Headers will be more different soon (if not we may unify them later on)

const messages = defineMessages({
  header: 'Stake pools list',
  card1Title: 'Research',
  card1Value: 'the stake pools that are participating in the network.',
  card2Title: 'Share',
  card2Value: 'specific views and sorting of stake pools.',
  card3Title: 'Compare',
  card3Value: 'stake pool details without other visualizations.',
})

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    height: '250px',
    background: palette.gradient,
  },
  card: {
    width: 300,
    height: 90,
  },
}))

const Header = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Grid
      container
      className={classes.wrapper}
      direction="column"
      justify="space-evenly"
      alignItems="center"
    >
      <Typography variant="h1">{tr(messages.header)}</Typography>
      <ScrollableCardsWrapper>
        <Grid container direction="row" justify="center" alignItems="center" wrap="nowrap">
          <DefaultNonClickableHeaderCard
            secondaryText={tr(messages.card1Value)}
            primaryText={tr(messages.card1Title)}
            icon={
              <img alt="" src="/static/assets/icons/staking-simulator/search-for-stakepool.svg" />
            }
            className={classes.card}
          />
          <DefaultNonClickableHeaderCard
            secondaryText={tr(messages.card2Value)}
            primaryText={tr(messages.card2Title)}
            icon={<img alt="" src="/static/assets/icons/share-specific-views.svg" />}
            className={classes.card}
          />
          <DefaultNonClickableHeaderCard
            secondaryText={tr(messages.card3Value)}
            primaryText={tr(messages.card3Title)}
            icon={<img alt="" src="/static/assets/icons/staking-simulator/compare.svg" />}
            className={classes.card}
          />
        </Grid>
      </ScrollableCardsWrapper>
    </Grid>
  )
}

export default Header
