// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'
import type {Theme} from '@material-ui/core'
import cn from 'classnames'

// TODO: Remove this function, content spacing is already in theme
// Note: this component/file bears the config for
// all of the spacings inside Cards and other components
// in order for them to be aligned properly on webpage.
// For all other spacings, we can still use theme.spacing in css.
// In other words, don't use this file as a new theme.spacing.
export const getDefaultSpacing = (theme: Theme) => theme.getContentSpacing()

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ({type, top = 1}) => theme.getContentSpacing(type === 'padding' ? top : 0),
    paddingBottom: ({type, bottom = 1}) => theme.getContentSpacing(type === 'padding' ? bottom : 0),
    paddingLeft: ({type, left = 1}) => theme.getContentSpacing(type === 'padding' ? left : 0),
    paddingRight: ({type, right = 1}) => theme.getContentSpacing(type === 'padding' ? right : 0),
    marginTop: ({type, top = 1}) => theme.getContentSpacing(type === 'margin' ? top : 0),
    marginBottom: ({type, bottom = 1}) => theme.getContentSpacing(type === 'margin' ? bottom : 0),
    marginLeft: ({type, left = 1}) => theme.getContentSpacing(type === 'margin' ? left : 0),
    marginRight: ({type, right = 1}) => theme.getContentSpacing(type === 'margin' ? right : 0),
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
  return <div className={cn(classes.root, className)}>{children}</div>
}

export default ContentSpacing
