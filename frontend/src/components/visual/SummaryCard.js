import React from 'react'
import {withStyles, createStyles, Card, Typography, Grid} from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    card: {
      padding: theme.spacing.unit * 2,
    },
    listRow: {
      'paddingTop': theme.spacing.unit * 2.5,
      'paddingBottom': theme.spacing.unit * 2.5,

      '&:not(:last-child)': {
        borderBottom: '0.5px solid gray',
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
  return <Card className={classes.card}>{children}</Card>
}

const Row = ({children, classes}) => {
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.listRow}
    >
      {children}
    </Grid>
  )
}

const Label = ({children}) => (
  <Grid item>
    <Typography variant="caption">{children}</Typography>
  </Grid>
)

const Value = ({children}) => (
  <Grid item>
    <Typography variant="body1">{children}</Typography>
  </Grid>
)

const SummaryCard = withStyles(styles)(_SummaryCard)
SummaryCard.Row = withStyles(styles)(Row)
SummaryCard.Label = Label
SummaryCard.Value = Value

export default SummaryCard
