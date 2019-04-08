import React from 'react'
import classnames from 'classnames'
import {withStyles, createStyles, Typography, Grid} from '@material-ui/core'

import {Card} from '@/components/visual'

const styles = ({spacing, palette}) =>
  createStyles({
    card: {
      padding: spacing.unit * 2,
    },
    listRow: {
      'paddingTop': spacing.unit * 2.5,
      'paddingBottom': spacing.unit * 2.5,

      '&:not(:last-child)': {
        borderBottom: `0.5px solid ${palette.unobtrusiveContentHighlight}`,
      },
      '&:last-child': {
        paddingBottom: 0,
      },
      '&:first-child': {
        paddingTop: 0,
      },
    },
  })

const _SummaryCard = ({classes, children}) => {
  return <Card classes={{root: classes.card}}>{children}</Card>
}

const Row = ({children, classes, className}) => {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classnames(classes.listRow, className)}
    >
      {children}
    </Grid>
  )
}

const Label = ({children}) => (
  <Grid item>
    <Typography variant="body1" color="textSecondary">
      {children}
    </Typography>
  </Grid>
)

const Value = ({children}) => (
  <Grid item>
    <Typography variant="body1" component="span">
      {children}
    </Typography>
  </Grid>
)

const SummaryCard = withStyles(styles)(_SummaryCard)
SummaryCard.Row = withStyles(styles)(Row)
SummaryCard.Label = Label
SummaryCard.Value = Value

export default SummaryCard
