import React from 'react'

import {Card, Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import classNames from 'classnames'

import CopyToClipboard from '@/components/common/CopyToClipboard'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing.unit * 2,
  },
  cardContent: {
    flex: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  flex: {
    display: 'flex',
  },
  centeredFlex: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'no-wrap',
    display: 'inline-block',
    maxWidth: '700px',
    verticalAlign: 'middle',
    paddingRight: 0,
  },
  normalCursor: {
    cursor: 'initial',
  },
}))

const EntityIdCard = ({iconRenderer, label, value, badge}) => {
  const classes = useStyles()
  return (
    <Card elevation={6} className={classNames(classes.card, classes.flex)}>
      {iconRenderer && (
        <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
          {iconRenderer}
        </Grid>
      )}
      <div className={classes.cardContent}>
        <EntityCardContent label={label} value={value} />
      </div>
      {badge && (
        <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
          {badge}
        </Grid>
      )}
    </Card>
  )
}

export const EntityCardContent = ({label, value, innerRef}) => {
  const classes = useStyles()
  return (
    <div ref={innerRef} className={classes.normalCursor}>
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Grid item>
        <Typography variant="body1" className={classes.value}>
          {value}
          <CopyToClipboard value={value} />
        </Typography>
      </Grid>
    </div>
  )
}

export default EntityIdCard
