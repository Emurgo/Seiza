import React from 'react'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import classNames from 'classnames'

import {Card} from '@/components/visual'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import EllipsizeMiddle from '@/components/visual/EllipsizeMiddle'

const useStyles = makeStyles((theme) => ({
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

const useCardStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
  },
}))

const EntityIdCard = ({iconRenderer, label, value, badge, showCopyIcon = true, copyValue}) => {
  const cardClasses = useCardStyles()
  const classes = useStyles()
  return (
    <Card classes={cardClasses}>
      {iconRenderer && (
        <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
          {iconRenderer}
        </Grid>
      )}
      <Grid item className={classes.cardContent}>
        <EntityCardContent
          label={label}
          value={value}
          showCopyIcon={showCopyIcon}
          copyValue={copyValue}
        />
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
    paddingTop: ({showCopyIcon}) => (showCopyIcon ? '12px' : 'initial'), // same value as in valueContainer's paddingBottom
  },
  valueContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: ({showCopyIcon}) => (showCopyIcon ? '48px' : 'initial'), // width of copy to clipboard icon
    paddingBottom: ({showCopyIcon}) => (showCopyIcon ? '12px' : 'initial'), // because icon background hover would be cut :/
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
export const EntityCardContent = ({
  label,
  value = '',
  innerRef,
  showCopyIcon = true,
  copyValue,
}) => {
  const classes = useContentStyles({showCopyIcon})

  return (
    <div className={classes.correctureWrapper}>
      <div ref={innerRef} className={classes.wrapper}>
        <Typography variant="overline" color="textSecondary">
          {label}
        </Typography>
        <Grid item className={classes.valueContainer}>
          <Typography style={{fontFamily: 'DroidSansMono'}} className={classes.hidden}>
            <EllipsizeMiddle value={value} />
          </Typography>
          {showCopyIcon && (
            <div className={classes.copyToClipboard}>
              <CopyToClipboard value={copyValue || value} />
            </div>
          )}
        </Grid>
      </div>
    </div>
  )
}

export default EntityIdCard
