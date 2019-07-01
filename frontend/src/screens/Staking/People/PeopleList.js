// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {VisualHash, Link, EntityCardContent} from '@/components/visual'
import {AdaValue} from '@/components/common'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  owner: 'Owner',
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
    padding: theme.spacing(3),
  },
  owners: {
    '& > *': {
      borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    '& > :last-child': {
      borderBottom: 'none',
    },
    '& > :first-child': {
      paddingTop: theme.spacing(1),
    },
  },
  ownersWrapper: {
    paddingTop: theme.spacing(3),
  },
  stakeKeyLink: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    maxWidth: 300,
    minWidth: 50,
  },
}))

const RowHeader = ({poolHash, poolName}) => {
  return (
    <EntityCardContent
      label={poolName}
      value={poolHash}
      showCopyIcon={false}
      iconRenderer={<VisualHash value={poolHash} size={48} />}
    />
  )
}

const Owner = ({stakingKey, pledge}) => {
  const classes = useStyles()
  return (
    <Grid key={stakingKey} container justify="space-between" wrap="nowrap">
      <Typography variant="body1" className={classes.stakeKeyLink} noWrap>
        <Link to={routeTo.stakingKey.user(stakingKey)}>{stakingKey}</Link>
      </Typography>
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
        <Grid container>
          <Typography variant="overline" color="textSecondary">
            {tr(messages.owner)}
          </Typography>
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
