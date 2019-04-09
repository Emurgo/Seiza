// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'
import type {Theme} from '@material-ui/core'
import cn from 'classnames'

// Note: this component/file bears the config for
// all of the spacings inside Cards and other components
// in order for them to be aligned properly on webpage.
// For all other spacings, we can still use theme.spacing.unit in css.
// In other words, don't use this file as a new theme.spacing.unit.
export const getDefaultSpacing = (theme: Theme) => theme.spacing.unit * 4

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ({type, top = 1}) => (type === 'padding' ? getDefaultSpacing(theme) * top : 0),
    paddingBottom: ({type, bottom = 1}) =>
      type === 'padding' ? getDefaultSpacing(theme) * bottom : 0,
    paddingLeft: ({type, left = 1}) => (type === 'padding' ? getDefaultSpacing(theme) * left : 0),
    paddingRight: ({type, right = 1}) =>
      type === 'padding' ? getDefaultSpacing(theme) * right : 0,
    marginTop: ({type, top = 1}) => (type === 'margin' ? getDefaultSpacing(theme) * top : 0),
    marginBottom: ({type, bottom = 1}) =>
      type === 'margin' ? getDefaultSpacing(theme) * bottom : 0,
    marginLeft: ({type, left = 1}) => (type === 'margin' ? getDefaultSpacing(theme) * left : 0),
    marginRight: ({type, right = 1}) => (type === 'margin' ? getDefaultSpacing(theme) * right : 0),
    display: 'inherit', // this part is important
  },
}))

type SpaceType = 'margin' | 'padding'

type ContentSpacingProps = {
  children: React$Node,
  top?: number,
  bottom?: number,
  left?: number,
  right?: number,
  type?: SpaceType,
  className?: string,
}

const ContentSpacing = ({
  children,
  top,
  bottom,
  left,
  right,
  type = 'padding',
  className,
}: ContentSpacingProps) => {
  const classes = useStyles({type, top, bottom, left, right})
  return <div className={cn(className, classes.root)}>{children}</div>
}

export default ContentSpacing
