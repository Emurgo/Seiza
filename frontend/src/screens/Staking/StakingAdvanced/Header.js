// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {HeaderCard, HeaderCardContainer, ScrollableCardsWrapper} from '@/components/common'

const messages = defineMessages({
  header: 'Staking Center Simulator',
  card1Title: 'Search',
  card1Value: 'for stake pool you like',
  card2Title: 'Download or share',
  card2Value: 'your results in just a click',
  card3Title: 'Compare',
  card3Value: 'stake pool details',
})

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    height: '250px',
    background: palette.gradient,
  },
  card: {
    width: '270px',
    marginLeft: '30px',
    marginRight: '30px',
    padding: spacing(1),
  },
  cardIcon: {
    paddingRight: spacing(1),
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
          <HeaderCardContainer>
            <HeaderCard
              smallPrimaryText
              secondaryText={tr(messages.card1Value)}
              primaryText={tr(messages.card1Title)}
              icon={
                <img alt="" src="/static/assets/icons/staking-simulator/search-for-stakepool.svg" />
              }
            />
          </HeaderCardContainer>
          <HeaderCardContainer>
            <HeaderCard
              smallPrimaryText
              secondaryText={tr(messages.card2Value)}
              primaryText={tr(messages.card2Title)}
              icon={
                <img alt="" src="/static/assets/icons/staking-simulator/download-or-share.svg" />
              }
            />
          </HeaderCardContainer>
          <HeaderCardContainer>
            <HeaderCard
              smallPrimaryText
              secondaryText={tr(messages.card3Value)}
              primaryText={tr(messages.card3Title)}
              icon={<img alt="" src="/static/assets/icons/staking-simulator/compare.svg" />}
            />
          </HeaderCardContainer>
        </Grid>
      </ScrollableCardsWrapper>
    </Grid>
  )
}

export default Header
