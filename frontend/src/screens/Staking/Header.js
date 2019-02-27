// @flow

import React from 'react'
import {compose} from 'redux'
import {Grid, Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'

// TODO: consider renaming the component or using different one
import {MetricsCard} from '@/components/visual'

const I18N_PREFIX = 'staking.header'

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'Explore Stake Pools',
  },
  card1: {
    id: `${I18N_PREFIX}.card1`,
    defaultMessage: 'You can search for stake pool you like',
  },
  card2: {
    id: `${I18N_PREFIX}.card2`,
    defaultMessage: 'You can download or share it',
  },
  card3: {
    id: `${I18N_PREFIX}.card3`,
    defaultMessage: 'You can compare it by diff features',
  },
})

const styles = ({palette}) =>
  createStyles({
    wrapper: {
      height: '250px',
      background: palette.gradient,
    },
    card: {
      maxWidth: '250px',
      marginLeft: '30px',
      marginRight: '30px',
    },
  })

const Header = ({classes, i18n: {translate}}) => (
  <Grid
    container
    className={classes.wrapper}
    direction="column"
    justify="space-evenly"
    alignItems="center"
  >
    <Typography variant="h4">{translate(messages.header)}</Typography>
    <Grid container direction="row" justify="center" alignItems="center">
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={translate(messages.card1)}
      />
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={translate(messages.card2)}
      />
      <MetricsCard
        icon="epoch"
        metric={''}
        className={classes.card}
        value={translate(messages.card3)}
      />
    </Grid>
  </Grid>
)

export default compose(
  withI18n,
  withStyles(styles)
)(Header)
