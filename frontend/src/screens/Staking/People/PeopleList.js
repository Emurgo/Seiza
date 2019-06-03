// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {AdaValue, VisualHash, LinkTo} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  owner: 'Owner',
  pledge: 'Pledge',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    'background': theme.palette.background.paper,
    'borderRadius': '0 0 5px 5px',

    '& > *': {
      borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    },
    '& > :last-child': {
      borderBottom: 'none',
    },
  },
  row: {
    padding: theme.spacing.unit * 3,
  },
  owners: {
    '& > *': {
      borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 3,
    },
    '& > :last-child': {
      borderBottom: 'none',
    },
    '& > :first-child': {
      paddingTop: theme.spacing.unit,
    },
  },
  ownersWrapper: {
    paddingTop: theme.spacing.unit * 3,
  },
  visualHashWrapper: {
    paddingRight: theme.spacing.unit,
  },
  stakeKeyLink: {
    fontWeight: '600',
  },
}))

const RowHeader = ({poolHash, poolName}) => {
  const classes = useStyles()
  return (
    <Grid container>
      <Grid item className={classes.visualHashWrapper}>
        <VisualHash value={poolHash} size={37} />
      </Grid>
      <Grid item>
        <Grid container direction="column">
          <Typography variant="overline">{poolName}</Typography>
          <LinkTo.stakepool poolHash={poolHash}>
            <Typography variant="caption">{poolHash}</Typography>
          </LinkTo.stakepool>
        </Grid>
      </Grid>
    </Grid>
  )
}

const Owner = ({stakingKey, pledge}) => {
  const classes = useStyles()
  return (
    <Grid key={stakingKey} container justify="space-between">
      <LinkTo.stakingKey stakingKey={stakingKey}>
        <Typography color="inherit" variant="body1" className={classes.stakeKeyLink}>
          {stakingKey}
        </Typography>
      </LinkTo.stakingKey>
      <div>
        <AdaValue value={pledge} showCurrency />
      </div>
    </Grid>
  )
}

const Row = ({poolData}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <div className={classes.row}>
      <RowHeader poolHash={poolData.poolHash} poolName={poolData.name} />
      <div className={classes.ownersWrapper}>
        <Grid container justify="space-between">
          <Typography variant="overline">{tr(messages.owner)}</Typography>
          <Typography variant="overline">{tr(messages.pledge)}</Typography>
        </Grid>
        <div className={classes.owners}>
          {poolData.owners.map(({stakingKey, pledge}) => (
            <Owner key={stakingKey} stakingKey={stakingKey} pledge={pledge} />
          ))}
        </div>
      </div>
    </div>
  )
}

type PeopleListProps = {
  data: Array<Object>, // TODO: get graphql type
}

const PeopleList = ({data}: PeopleListProps) => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      {data.map((poolData) => (
        <Row key={poolData.poolHash} poolData={poolData} />
      ))}
    </div>
  )
}

export default PeopleList
