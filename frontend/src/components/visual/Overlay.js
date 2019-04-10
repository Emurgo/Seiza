// @flow
import React from 'react'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

const useContentStyles = makeStyles((theme) => ({
  overlayContent: {
    padding: theme.spacing.unit * 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    background: (props) => props.background || fade(theme.palette.text.primary, 0.2),
  },
}))

const useWrapperStyles = makeStyles({
  overlayWrapper: {
    position: 'relative',
  },
})

type ContentProps = {
  background?: string,
  children: ?React$Node,
  // Note: style is passed by Fade component
  style?: any,
}

// Note: Parent has to have position:relative
const OverlayContent = ({background, children, style}: ContentProps) => {
  const classes = useContentStyles({background})
  return (
    <div className={classes.overlayContent} style={style}>
      {children}
    </div>
  )
}

type WrapperProps = {
  children: ?React$Node,
  className?: string,
}

const OverlayWrapper = ({children, className}: WrapperProps) => {
  const classes = useWrapperStyles()
  return <div className={classnames(classes.overlayWrapper, className)}>{children}</div>
}

const Overlay = {
  Content: OverlayContent,
  Wrapper: OverlayWrapper,
}

export default Overlay
