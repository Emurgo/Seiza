// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {DefaultNonClickableHeaderCard, ScrollableCardsWrapper} from '@/components/common'

const messages = defineMessages({
  header: 'Simple Staking Simulator',
  card1Title: 'Get the rewards',
  card1Value: 'by delegating to a stake pool! Cardano is a Proof of Stake (PoS) Protocol.',
  card2Title: 'The most profitable',
  card2Value: 'stake pools you will find with our simulator help.',
  card3Title: 'Share the rewards',
  card3Value: 'with you proportionaly. Stake pools use ADA to participate in the Protocol.',
})

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    height: '250px',
    background: palette.gradient,
  },
  card: {
    width: 300,
    height: 100,
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
            icon={<img alt="" src="/static/assets/icons/staking-simulator/get-rewards.svg" />}
            className={classes.card}
          />
          <DefaultNonClickableHeaderCard
            secondaryText={tr(messages.card2Value)}
            primaryText={tr(messages.card2Title)}
            icon={
              <img alt="" src="/static/assets/icons/staking-simulator/search-for-stakepool.svg" />
            }
            className={classes.card}
          />
          <DefaultNonClickableHeaderCard
            secondaryText={tr(messages.card3Value)}
            primaryText={tr(messages.card3Title)}
            icon={<img alt="" src="/static/assets/icons/staking-simulator/share-rewards.svg" />}
            className={classes.card}
          />
        </Grid>
      </ScrollableCardsWrapper>
    </Grid>
  )
}

export default Header
