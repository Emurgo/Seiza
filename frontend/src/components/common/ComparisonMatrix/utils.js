// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {makeStyles} from '@material-ui/styles'

import {VisualHash} from '@/components/visual'

// TODO: we could type theme

export const getHeaderBackground = (theme: any) => darken(theme.palette.background.default, 0.04)

export const getBodyBackground = (theme: any) => theme.palette.background.paper

// So that zIndexes defined inside comparison matrix files dont affect outer files.
export const stackingContext = {position: 'relative', zIndex: 0}

// TODO: make something better than PADDING
export const PADDING = 16

export const ellipsizeStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const useItemIdentifierStyles = makeStyles((theme) => ({
  visualHashWrapper: {
    marginRight: theme.spacing(1),
  },
  ellipsis: {
    ...ellipsizeStyles,
    display: 'block',
  },
}))

type ItemIdentifierProps = {|
  identifier: string,
  title: string,
|}

export const ItemIdentifier = ({identifier, title}: ItemIdentifierProps) => {
  const classes = useItemIdentifierStyles()
  return (
    <Grid container wrap="nowrap" alignItems="center">
      <Grid item>
        <div className={classes.visualHashWrapper}>
          <VisualHash value={identifier} size={24} />
        </div>
      </Grid>
      {/* See: https://css-tricks.com/flexbox-truncated-text/ */}
      <Grid item style={{minWidth: 0}}>
        <Typography className={classes.ellipsis} variant="overline" color="textSecondary">
          {title}
        </Typography>
      </Grid>
    </Grid>
  )
}
