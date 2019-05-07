// @flow
import React from 'react'
import cn from 'classnames'
import {CardHeader, Typography, Grid} from '@material-ui/core'
import {Card, ContentSpacing} from '@/components/visual'

import {makeStyles} from '@material-ui/styles'
import type {Node} from 'react'

const useHeaderStyles = makeStyles(({spacing, palette}) => ({
  wrapper: {
    backgroundColor: palette.unobtrusiveContentHighlight,
    minHeight: '60px',
  },
  leftOffset: {
    paddingLeft: spacing.unit,
  },
}))

const useBodyStyles = makeStyles(({spacing, palette, breakpoints}) => ({
  rowWrapper: {
    borderBottom: `1px solid ${palette.unobtrusiveContentHighlight}`,
  },
  lastRow: {
    borderBottom: 'none',
  },
  value: {
    /* Responsive layout tricks */
    width: '100%',
    textAlign: 'right',
    [breakpoints.down('xs')]: {
      textAlign: 'left',
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
      <ContentSpacing left={1.5} right={1.5} top={0.3} bottom={0.3}>
        <Grid container alignItems="center" className={classes.wrapper} direction="row">
          {icon}
          <Typography className={classes.leftOffset} variant="overline" color="textSecondary">
            {label}
          </Typography>
          <Typography className={classes.leftOffset} variant="overline">
            {value}
          </Typography>
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

const RowSpacing = ({children, isLast = false}) => {
  const classes = useBodyStyles()
  return (
    <ContentSpacing type="margin" top={0} bottom={0} left={1.5} right={1.5}>
      <ContentSpacing
        top={0.5}
        bottom={0.5}
        left={0}
        right={0}
        className={cn(classes.rowWrapper, isLast && classes.lastRow)}
      >
        {children}
      </ContentSpacing>
    </ContentSpacing>
  )
}

const Body = ({items}: BodyProps) => {
  const classes = useBodyStyles()
  return (
    <ContentSpacing top={0.5} bottom={0.5} left={0} right={0}>
      {items.map(({label, value}, index, array) => (
        <RowSpacing key={index} isLast={index === array.length - 1}>
          <Grid container justify="space-between" alignItems="center" direction="row">
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="textSecondary">
                {label}
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={8}>
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
