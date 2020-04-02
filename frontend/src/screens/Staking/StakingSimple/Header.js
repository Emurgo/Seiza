// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {DefaultNonClickableHeaderCard, ScrollableCardsWrapper} from '@/components/common'

const messages = defineMessages({
  header: 'Simple Staking Simulator',
  card1Title: 'Delegate ADA',
  card1Value: 'to get rewards while helping securing the network.',
  card2Title: 'How to participate?',
  card2Value: 'find on our list the most profitable stake pool to delegate. It’s risk-free.',
  card3Title: 'When do I get the rewards?',
  card3Value: 'They are automatically delivered by the protocol at the end of a period (aka Epoch)',
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
