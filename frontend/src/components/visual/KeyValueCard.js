// @flow
import React from 'react'
import classnames from 'classnames'
import {CardHeader, Typography, Grid} from '@material-ui/core'
import {Card, ContentSpacing} from '@/components/visual'

import {makeStyles} from '@material-ui/styles'
import type {Node} from 'react'

const useHeaderStyles = makeStyles(({spacing, palette}) => ({
  wrapper: {
    backgroundColor: palette.unobtrusiveContentHighlight,
    minHeight: '60px',
  },
}))

const useBodyStyles = makeStyles(({spacing, palette}) => ({
  // Note(ppershing): we need rowWrapper because
  // :after applied on flex-container (.row) does not work as you would think.
  // At the same time, we do not want to apply margins to the row
  // as it messes up with the background
  rowWrapper: {
    '&:after': {
      content: '""',
      display: 'block',
      marginLeft: spacing.unit * 4,
      marginRight: spacing.unit * 4,
      marginTop: '-1px', // move border into the row
      borderBottom: `1px solid ${palette.unobtrusiveContentHighlight}`,
    },
    '&:last-child:after': {
      content: 'none',
    },
  },
  row: {
    paddingTop: spacing.unit * 2.5,
    paddingBottom: spacing.unit * 2.5,
    paddingLeft: spacing.unit * 4,
    paddingRight: spacing.unit * 4,
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
    <Card classes={{root: classnames(classes.root, className)}}>
      <CardHeader component={() => header} />
      {children}
    </Card>
  )
}

type HeaderProps = {|
  +logo?: Node,
  +label: string,
  +value: string,
|}

const Header = ({logo, label, value}: HeaderProps) => {
  const classes = useHeaderStyles()
  return (
    <div className={classes.wrapper}>
      <ContentSpacing top={0} bottom={0}>
        <Grid
          container
          alignItems="center"
          className={classes.wrapper}
          justify="space-between"
          direction="row"
        >
          {logo && <Grid item>{logo}</Grid>}
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {label}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline">{value}</Typography>
          </Grid>
        </Grid>
      </ContentSpacing>
    </div>
  )
}

KeyValueCard.Header = Header

// Note: Arrays needs to be covariant. See
// https://medium.com/@forbeslindesay/covariance-and-contravariance-c3b43d805611
type BodyProps = {|
  +items: $ReadOnlyArray<{+label: string, +value: Node}>,
|}

const Body = ({items}: BodyProps) => {
  const classes = useBodyStyles()
  return items.map(({label, value}) => (
    <div key={label} className={classes.rowWrapper}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.row}
        direction="row"
      >
        <Grid item>
          <Typography variant="body1" color="textSecondary">
            {label}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{value}</Typography>
        </Grid>
      </Grid>
    </div>
  ))
}

KeyValueCard.Body = Body

export default KeyValueCard
