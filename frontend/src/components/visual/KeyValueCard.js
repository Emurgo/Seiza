// @flow
import React from 'react'
import classnames from 'classnames'
import {CardHeader, CardContent, Typography, Grid} from '@material-ui/core'
import {Card} from '@/components/visual'

import {makeStyles} from '@material-ui/styles'
import type {Node} from 'react'

const useHeaderStyles = makeStyles(({palette}) => ({
  wrapper: {
    backgroundColor: palette.unobtrusiveContentHighlight,
    minHeight: '60px',
    paddingLeft: '30px',
    paddingRight: '30px',
  },
}))

const useBodyStyles = makeStyles(({palette}) => ({
  wrapper: {
    paddingLeft: '15px',
    paddingRight: '15px',
  },
  row: {
    'paddingTop': '15px',
    'paddingBottom': '15px',
    'borderBottom': `1px solid ${palette.grey[200]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
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
      <CardContent>{children}</CardContent>
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
  return (
    <Grid container className={classes.wrapper} direction="row">
      {items.map(({label, value}) => (
        <Grid
          container
          key={label}
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
      ))}
    </Grid>
  )
}

KeyValueCard.Body = Body

export default KeyValueCard
