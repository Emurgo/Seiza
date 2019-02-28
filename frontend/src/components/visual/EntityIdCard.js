import React from 'react'
import {compose} from 'redux'

import {withStyles, createStyles, Card, Typography, Grid} from '@material-ui/core'
import classNames from 'classnames'

import CopyToClipboard from '@/components/common/CopyToClipboard'

const styles = (theme) =>
  createStyles({
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
  })

const EntityIdCard = ({classes, iconRenderer, label, value}) => (
  <Card className={classNames(classes.card, classes.flex)}>
    <Grid item className={classNames(classes.flex, classes.centeredFlex)}>
      {iconRenderer}
    </Grid>

    <div className={classes.cardContent}>
      <Typography variant="caption">{label}</Typography>
      <Grid item>
        <span className={classes.value}>{value}</span>
        <CopyToClipboard value={value} />
      </Grid>
    </div>
  </Card>
)

export default compose(withStyles(styles))(EntityIdCard)
