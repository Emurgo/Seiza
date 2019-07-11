// @flow

import React from 'react'
import {compose} from 'redux'
import {Grid, Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import ReactMarkdown from 'react-markdown'

import {Card} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'

import searchForStakepoolIcon from '@/static/assets/icons/staking-simulator/search-for-stakepool.svg'
import downloadOrShareIcon from '@/static/assets/icons/staking-simulator/download-or-share.svg'
import compareIcon from '@/static/assets/icons/staking-simulator/compare.svg'

const messages = defineMessages({
  header: 'Explore Stake Pools',
  card1: '## Search\nfor stake pool you like',
  card2: '## Download or share\nyour results in just a click',
  card3: '## Compare\nstake pool details',
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
      padding: spacing(1),
    },
    cardIcon: {
      paddingRight: spacing(1),
    },
  })

const cardRenderers = {
  paragraph: ({children}) => <Typography variant="body1">{children}</Typography>,
  heading: ({children, level}) => (
    <Typography variant="h4">
      <strong>{children}</strong>
    </Typography>
  ),
}

const StakePoolCard = withStyles(styles)(({classes, value, iconSrc}) => (
  <Card classes={{root: classes.card}}>
    <Grid container direction="row" alignItems="center" wrap="nowrap">
      <Grid item className={classes.cardIcon}>
        <img alt="" src={iconSrc} />
      </Grid>
      <Grid item>
        <ReactMarkdown source={value} renderers={cardRenderers} />
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
      <StakePoolCard value={translate(messages.card1)} iconSrc={searchForStakepoolIcon} />
      <StakePoolCard value={translate(messages.card2)} iconSrc={downloadOrShareIcon} />
      <StakePoolCard value={translate(messages.card3)} iconSrc={compareIcon} />
    </Grid>
  </Grid>
)

export default compose(
  withI18n,
  withStyles(styles)
)(Header)
