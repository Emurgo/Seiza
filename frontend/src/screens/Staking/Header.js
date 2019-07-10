// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import ReactMarkdown from 'react-markdown'

import {Card} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

import searchForStakepoolIcon from '@/static/assets/icons/staking-simulator/search-for-stakepool.svg'
import downloadOrShareIcon from '@/static/assets/icons/staking-simulator/download-or-share.svg'
import compareIcon from '@/static/assets/icons/staking-simulator/compare.svg'

const messages = defineMessages({
  header: 'Explore Stake Pools',
  card1: '## Search\nfor stake pool you like',
  card2: '## Download or share\nyour results in just a click',
  card3: '## Compare\nstake pool details',
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

const cardRenderers = {
  paragraph: ({children}) => <Typography variant="body1">{children}</Typography>,
  heading: ({children, level}) => (
    <Typography variant="h4">
      <strong>{children}</strong>
    </Typography>
  ),
}

const StakePoolCard = ({value, iconSrc}) => {
  const classes = useStyles()
  return (
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
  )
}

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
      <Grid container direction="row" justify="center" alignItems="center">
        <StakePoolCard value={tr(messages.card1)} iconSrc={searchForStakepoolIcon} />
        <StakePoolCard value={tr(messages.card2)} iconSrc={downloadOrShareIcon} />
        <StakePoolCard value={tr(messages.card3)} iconSrc={compareIcon} />
      </Grid>
    </Grid>
  )
}

export default Header
