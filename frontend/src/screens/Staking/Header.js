// @flow

import React from 'react'
import {compose} from 'redux'
import {Grid, Typography, Card, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import iconEpoch from '@/assets/icons/metrics-epoch.svg'
import {withI18n} from '@/i18n/helpers'

const messages = defineMessages({
  header: 'Explore Stake Pools',
  card1: 'You can search for stake pool you like',
  card2: 'You can download or share it',
  card3: 'You can compare it by diff features',
})

const styles = ({palette, spacing}) =>
  createStyles({
    wrapper: {
      height: '250px',
      background: palette.gradient,
    },
    card: {
      width: '270px',
      marginLeft: '30px',
      marginRight: '30px',
      boxShadow: 'none',
      padding: spacing.unit,
    },
    cardIcon: {
      paddingRight: spacing.unit,
    },
  })

const StakePoolCard = withStyles(styles)(({classes, value, iconSrc}) => (
  <Card className={classes.card}>
    <Grid container direction="row" alignItems="center" wrap="nowrap">
      <Grid item className={classes.cardIcon}>
        <img alt="" src={iconSrc} />
      </Grid>
      <Grid item>
        <Typography variant="h4">{value}</Typography>
      </Grid>
    </Grid>
  </Card>
))

const Header = ({classes, i18n: {translate}}) => (
  <Grid
    container
    className={classes.wrapper}
    direction="column"
    justify="space-evenly"
    alignItems="center"
  >
    <Typography variant="h1">{translate(messages.header)}</Typography>
    <Grid container direction="row" justify="center" alignItems="center">
      <StakePoolCard value={translate(messages.card1)} iconSrc={iconEpoch} />
      <StakePoolCard value={translate(messages.card2)} iconSrc={iconEpoch} />
      <StakePoolCard value={translate(messages.card3)} iconSrc={iconEpoch} />
    </Grid>
  </Grid>
)

export default compose(
  withI18n,
  withStyles(styles)
)(Header)
