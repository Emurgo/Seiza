// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'
import cn from 'classnames'

// Note: this component/file bears the config for
// all of the spacings inside Cards and other components
// in order for them to be aligned properly on webpage.
// For all other spacings, we can still use theme.spacing in css.
// In other words, don't use this file as a new theme.spacing.

const useStyles = makeStyles(({getContentSpacing}) => ({
  root: {
    paddingTop: ({type, top = 1}) => getContentSpacing(type === 'padding' ? top : 0),
    paddingBottom: ({type, bottom = 1}) => getContentSpacing(type === 'padding' ? bottom : 0),
    paddingLeft: ({type, left = 1}) => getContentSpacing(type === 'padding' ? left : 0),
    paddingRight: ({type, right = 1}) => getContentSpacing(type === 'padding' ? right : 0),
    marginTop: ({type, top = 1}) => getContentSpacing(type === 'margin' ? top : 0),
    marginBottom: ({type, bottom = 1}) => getContentSpacing(type === 'margin' ? bottom : 0),
    marginLeft: ({type, left = 1}) => getContentSpacing(type === 'margin' ? left : 0),
    marginRight: ({type, right = 1}) => getContentSpacing(type === 'margin' ? right : 0),
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
