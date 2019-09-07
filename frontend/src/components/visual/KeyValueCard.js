// @flow
import React from 'react'
import cn from 'classnames'
import {CardHeader, Typography, Grid} from '@material-ui/core'
import {Card, ContentSpacing} from '@/components/visual'

import {makeStyles} from '@material-ui/styles'
import type {Node} from 'react'

const useHeaderStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    minHeight: 60,
    backgroundColor: theme.palette.unobtrusiveContentHighlight,
    paddingLeft: theme.getContentSpacing(1.5),
    paddingRight: theme.getContentSpacing(1.5),
    paddingTop: theme.getContentSpacing(0.25),
    paddingBottom: theme.getContentSpacing(0.25),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.getContentSpacing(0.5),
      paddingRight: theme.getContentSpacing(0.5),
    },
  },
  leftOffset: {
    paddingLeft: theme.spacing(1),
  },
}))

const useBodyStyles = makeStyles((theme) => ({
  wrapper: {
    marginLeft: theme.getContentSpacing(1.5),
    marginRight: theme.getContentSpacing(1.5),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.getContentSpacing(0.5),
      marginRight: theme.getContentSpacing(0.5),
    },
  },
  rowWrapper: {
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    paddingTop: theme.getContentSpacing(0.5),
    paddingBottom: theme.getContentSpacing(0.5),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.getContentSpacing(0.25),
      paddingBottom: theme.getContentSpacing(0.25),
    },
  },
  lastRow: {
    borderBottom: 'none',
  },
  value: {
    /* Responsive layout tricks */
    width: '100%',
    textAlign: 'right',
  },
}))

const useMainStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}))

type MainProps = {|
  +header: Node,
  +children: ?Node,
  +className?: string,
|}

const KeyValueCard = ({children, header, className}: MainProps) => {
  const classes = useMainStyles()
  return (
    <Card classes={{root: cn(classes.root, className)}}>
      <CardHeader component={() => header} />
      {children}
    </Card>
  )
}

type HeaderProps = {|
  +icon?: Node,
  +label: string,
  +value: string,
|}

const Header = ({icon, label, value}: HeaderProps) => {
  const classes = useHeaderStyles()
  return (
    <div className={classes.wrapper}>
      <Grid container alignItems="center" direction="row">
        {icon}
        <Typography className={classes.leftOffset} variant="overline" color="textSecondary">
          {label}
        </Typography>
        <Typography className={classes.leftOffset} variant="overline">
          {value}
        </Typography>
      </Grid>
    </div>
  )
}

KeyValueCard.Header = Header

// Note: Arrays needs to be covariant. See
// https://medium.com/@forbeslindesay/covariance-and-contravariance-c3b43d805611
type BodyProps = {|
  +items: $ReadOnlyArray<{+label: string, +value: Node}>,
|}

const RowSpacing = ({children, isLast = false}) => {
  const classes = useBodyStyles()
  return (
    <div className={classes.wrapper}>
      <div className={cn(classes.rowWrapper, isLast && classes.lastRow)}>{children}</div>
    </div>
  )
}

const Body = ({items}: BodyProps) => {
  const classes = useBodyStyles()
  return (
    <ContentSpacing top={0.5} bottom={0.5} left={0} right={0}>
      {items.map(({label, value}, index, array) => (
        <RowSpacing key={index} isLast={index === array.length - 1}>
          <Grid container justify="space-between" alignItems="flex-start" direction="row">
            <Grid item xs={4}>
              <Typography variant="body1" color="textSecondary">
                {label}
              </Typography>
            </Grid>
            <Grid item container xs={8}>
              <Typography variant="body1" className={classes.value}>
                {value}
              </Typography>
            </Grid>
          </Grid>
        </RowSpacing>
      ))}
    </ContentSpacing>
  )
}

KeyValueCard.Body = Body

export default KeyValueCard
