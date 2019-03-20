import React from 'react'

import {Card, Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import classNames from 'classnames'

import CopyToClipboard from '@/components/common/CopyToClipboard'
import EllipsizeMiddle from '@/components/visual/EllipsizeMiddle'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing.unit * 2,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'hidden',
  },
  flex: {
    display: 'flex',
  },
  centeredFlex: {
    alignItems: 'center',
    justifyContent: 'center',
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
      <Grid item className={classes.cardContent}>
        <EntityCardContent label={label} value={value} />
      </Grid>
      {badge && (
        <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
          {badge}
        </Grid>
      )}
    </Card>
  )
}

const useContentStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: 'initial',
    overflow: 'hidden',
    paddingTop: '12px', // same value as in valueContainer's paddingBottom
  },
  valueContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '48px', // width of copy to clipboard icon
    paddingBottom: '12px', // because icon background hover would be cut :/
    position: 'relative',
  },
  copyToClipboard: {
    position: 'absolute',
    top: -12, // 1/4 of clipboard icon height to center
    right: 0,
  },
  hidden: {
    overflow: 'hidden',
  },
  correctureWrapper: {
    display: 'flex',
    overflow: 'hidden',
  },
}))

// Note: User is unable to select whole text at once
// due to cutting the text into different HTML elements
export const EntityCardContent = ({label, value = '', innerRef}) => {
  const classes = useContentStyles()

  return (
    <div className={classes.correctureWrapper}>
      <div ref={innerRef} className={classes.wrapper}>
        <Typography variant="overline" color="textSecondary">
          {label}
        </Typography>
        <Grid item className={classes.valueContainer}>
          <Typography variant="body1" className={classes.hidden}>
            <EllipsizeMiddle value={value} />
          </Typography>
          <div className={classes.copyToClipboard}>
            <CopyToClipboard value={value} />
          </div>
        </Grid>
      </div>
    </div>
  )
}

export default EntityIdCard
