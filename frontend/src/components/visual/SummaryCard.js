import React from 'react'
import cn from 'classnames'
import {withStyles, createStyles, Typography, Grid} from '@material-ui/core'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card, ContentSpacing} from '@/components/visual'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'

const styles = (theme) =>
  createStyles({
    card: {
      overflow: 'visible',
    },
    // See note in KeyValueCard as to why we need this
    clickableListWrapper: {
      '&:hover': {
        '&:after': {
          borderColor: 'transparent',
        },
      },
    },
    listRowWrapper: {
      '&:after': {
        content: '""',
        display: 'block',
        marginLeft: getDefaultSpacing(theme),
        marginRight: getDefaultSpacing(theme),
        border: `0.5px solid ${theme.palette.unobtrusiveContentHighlight}`,
      },
      '&:last-child:after': {
        content: '""',
        display: 'none',
      },
    },
    listRow: {
      paddingTop: theme.spacing.unit * 2.5,
      paddingBottom: theme.spacing.unit * 2.5,
      paddingLeft: getDefaultSpacing(theme),
      paddingRight: getDefaultSpacing(theme),
    },
    clickableRow: {
      'transition': theme.hover.transitionOut(['box-shadow']),
      '&:hover': {
        marginTop: '-1px',
        borderTop: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
        borderRadius: '3px',
        boxShadow: `0px 10px 30px ${fade(theme.palette.text.primary, 0.11)}`,
        transition: theme.hover.transitionIn(['box-shadow']),
      },
    },
  })

const _SummaryCard = ({classes, children}) => (
  <Card classes={{root: classes.card}}>
    <ContentSpacing left={0} right={0} bottom={0.5} top={0.5}>
      {children}
    </ContentSpacing>
  </Card>
)

const Row = ({children, onClick, classes, className}) => (
  <div className={cn(classes.listRowWrapper, !!onClick && classes.clickableListWrapper)}>
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      onClick={onClick}
      className={cn(classes.listRow, className, !!onClick && classes.clickableRow)}
    >
      {children}
    </Grid>
  </div>
)

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
