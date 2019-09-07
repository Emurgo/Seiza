// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {HeaderCard, HeaderCardContainer, ScrollableCardsWrapper} from '@/components/common'

import searchForStakepoolIcon from '@/static/assets/icons/staking-simulator/search-for-stakepool.svg'

const messages = defineMessages({
  header: 'Explore Stake Pools',
  card1Title: 'Search',
  card1Value: 'for most profitable stake pools for you.',
})

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    height: '250px',
    background: palette.gradient,
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
      <Grid container direction="row" justify="center" alignItems="center" wrap="nowrap">
        <ScrollableCardsWrapper>
          <HeaderCardContainer>
            <HeaderCard
              smallPrimaryText
              secondaryText={tr(messages.card1Value)}
              primaryText={tr(messages.card1Title)}
              icon={<img alt="" src={searchForStakepoolIcon} />}
            />
          </HeaderCardContainer>
        </ScrollableCardsWrapper>
      </Grid>
    </Grid>
  )
}

export default Header
