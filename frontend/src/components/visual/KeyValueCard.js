// @flow
import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  createStyles,
  withStyles,
} from '@material-ui/core'

const headerStyles = ({palette}) =>
  createStyles({
    wrapper: {
      backgroundColor: palette.grey[200],
      minHeight: '60px',
      paddingLeft: '30px',
      paddingRight: '30px',
    },
    label: {
      color: palette.grey[500],
    },
  })

const bodyStyles = ({palette}) =>
  createStyles({
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
    label: {
      color: palette.grey[500],
    },
  })

const mainStyles = () =>
  createStyles({
    wrapper: {
      width: '100%',
    },
  })

const _KeyValueCard = ({classes, children, header}) => (
  <Card className={classes.wrapper}>
    <CardHeader component={() => header} />
    <CardContent>{children}</CardContent>
  </Card>
)

const KeyValueCard = withStyles(mainStyles)(_KeyValueCard)

const _Header = ({classes, logo, label, value}) => (
  <Grid
    container
    alignItems="center"
    className={classes.wrapper}
    justify="space-between"
    direction="row"
  >
    {logo && (
      <Grid item className={classes.logo}>
        {logo}
      </Grid>
    )}
    <Grid item>
      <Typography className={classes.label}>{label}</Typography>
    </Grid>
    <Grid item className={classes.value}>
      {value}
    </Grid>
  </Grid>
)

KeyValueCard.Header = withStyles(headerStyles)(_Header)

const _Body = ({items, classes}) => (
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
          <Typography className={classes.label}>{label}</Typography>
        </Grid>
        <Grid item>{value}</Grid>
      </Grid>
    ))}
  </Grid>
)

KeyValueCard.Body = withStyles(bodyStyles)(_Body)

export default KeyValueCard
