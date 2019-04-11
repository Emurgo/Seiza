import React from 'react'
import classnames from 'classnames'
import {withStyles, createStyles, Typography, Grid} from '@material-ui/core'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card} from '@/components/visual'

const styles = ({spacing, hover, palette}) =>
  createStyles({
    card: {
      overflow: 'visible',
    },
    // See note in KeyValueCard as to why we need this
    listRowWrapper: {
      '&:after': {
        content: '""',
        display: 'block',
        marginLeft: spacing.unit * 4,
        marginRight: spacing.unit * 4,
        borderBottom: `1px solid ${palette.unobtrusiveContentHighlight}`,
      },
      '&:last-child:after': {
        content: '""',
        borderBottom: 'none',
        display: 'block',
      },
    },
    listRow: {
      paddingTop: spacing.unit * 2.5,
      paddingBottom: spacing.unit * 2.5,
      paddingLeft: spacing.unit * 4,
      paddingRight: spacing.unit * 4,
    },
    clickableRow: {
      'transition': hover.transitionOut(['box-shadow']),
      '&:hover': {
        marginTop: '-1px',
        borderTop: `1px solid ${palette.unobtrusiveContentHighlight}`,
        borderRadius: '3px',
        boxShadow: `0px 10px 30px ${fade(palette.text.primary, 0.11)}`,
        transition: hover.transitionIn(['box-shadow']),
      },
    },
  })

const _SummaryCard = ({classes, children}) => {
  return <Card classes={{root: classes.card}}>{children}</Card>
}

const Row = ({children, onClick, classes, className}) => {
  return (
    <div className={classes.listRowWrapper}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        onClick={onClick}
        className={classnames(classes.listRow, className, {[classes.clickableRow]: !!onClick})}
      >
        {children}
      </Grid>
    </div>
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
