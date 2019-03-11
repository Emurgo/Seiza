// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

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
    background: (props) => props.background || 'rgba(0, 0, 0, 0.2)',
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
}

// Note: Parent has to have position:relative
const OverlayContent = ({background, children}: ContentProps) => {
  const classes = useContentStyles({background})
  return children ? <div className={classes.overlayContent}>{children}</div> : null
}

type WrapperProps = {
  children: ?React$Node,
}

const OverlayWrapper = ({children}: WrapperProps) => {
  const classes = useWrapperStyles()
  return <div className={classes.overlayWrapper}>{children}</div>
}

const Overlay = {
  Content: OverlayContent,
  Wrapper: OverlayWrapper,
}

export default Overlay
