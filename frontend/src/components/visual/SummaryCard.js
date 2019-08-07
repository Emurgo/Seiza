import React from 'react'
import cn from 'classnames'
import {Typography, Grid} from '@material-ui/core'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card, ContentSpacing} from '@/components/visual'
import {getDefaultSpacing} from '@/components/visual/ContentSpacing'
import {makeStyles} from '@material-ui/styles'

const useRowStyles = makeStyles((theme) => ({
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
      marginLeft: getDefaultSpacing(theme) / 2,
      marginRight: getDefaultSpacing(theme) / 2,
      [theme.breakpoints.up('sm')]: {
        marginLeft: getDefaultSpacing(theme),
        marginRight: getDefaultSpacing(theme),
      },
      border: `0.5px solid ${theme.palette.unobtrusiveContentHighlight}`,
    },
    '&:last-child:after': {
      display: ({showLastSeparator}) => (showLastSeparator ? 'block' : 'none'),
    },
  },
  listRow: {
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    paddingLeft: getDefaultSpacing(theme) / 2,
    paddingRight: getDefaultSpacing(theme) / 2,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      paddingLeft: getDefaultSpacing(theme),
      paddingRight: getDefaultSpacing(theme),
    },
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
}))

const useCardStyles = makeStyles((theme) => ({
  card: {
    overflow: 'visible',
  },
}))
const SummaryCard = ({children}) => {
  const classes = useCardStyles()
  return (
    <Card classes={{root: classes.card}}>
      <ContentSpacing left={0} right={0} bottom={0.5} top={0.5}>
        {children}
      </ContentSpacing>
    </Card>
  )
}

const Row = ({children, onClick, className, hideSeparator = false, showLastSeparator = false}) => {
  const classes = useRowStyles({showLastSeparator})
  const clickable = !!onClick
  return (
    <div
      className={cn(
        !hideSeparator && classes.listRowWrapper,
        clickable && classes.clickableListWrapper
      )}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        onClick={onClick}
        className={cn(classes.listRow, className, clickable && classes.clickableRow)}
      >
        {children}
      </Grid>
    </div>
  )
}
const Label = ({children}) => (
  <Grid item xs={4}>
    <Typography variant="body1" color="textSecondary">
      {children}
    </Typography>
  </Grid>
)

const useValueStyles = makeStyles((theme) => ({
  value: {
    /* Responsive layout tricks */
    width: '100%',
    textAlign: 'right',
  },
}))

const Value = ({children}) => {
  const classes = useValueStyles()
  return (
    <Grid container justify="flex-end" item xs={8}>
      <Typography variant="body1" component="span" className={classes.value}>
        {children}
      </Typography>
    </Grid>
  )
}

SummaryCard.Row = Row
SummaryCard.Label = Label
SummaryCard.Value = Value

export default SummaryCard
