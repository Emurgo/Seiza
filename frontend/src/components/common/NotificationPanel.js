// @flow

import React from 'react'
import cn from 'classnames'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import AlertIcon from '@/static/assets/icons/syncing-alert.svg'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundImage: theme.palette.buttons.getContainedGradient().background,
    padding: theme.spacing(1.5),
  },
  text: {
    color: theme.palette.background.paper,
  },
  mainText: {
    fontWeight: 700,
  },
  message: {
    fontSize: theme.typography.fontSize * 0.875,
  },
  paddedRight: {
    paddingRight: theme.spacing(1),
  },
}))

type Props = {|
  title: string | React$Node,
  message: string | React$Node,
|}

export default ({title, message}: Props) => {
  const classes = useStyles()

  return (
    <Grid
      className={classes.wrapper}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <img alt="" src={AlertIcon} className={classes.paddedRight} />

      <Typography
        variant="overline"
        className={cn(classes.text, classes.mainText, classes.paddedRight)}
      >
        {title}
      </Typography>
      <Typography variant="caption" className={cn(classes.text, classes.message)}>
        {message}
      </Typography>
    </Grid>
  )
}
