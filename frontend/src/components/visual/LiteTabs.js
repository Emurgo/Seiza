import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import {Tabs as MuiTabs, Tab as MuiTab} from '@material-ui/core'
import {makeStyles, useTheme} from '@material-ui/styles'

export const getPadding = (theme) => theme.spacing.unit * 3
const useTabStyles = makeStyles((theme) => ({
  root: {
    minWidth: 'initial',
    minHeight: 'initial',
  },
  labelContainer: {
    'padding': `0px ${getPadding(theme)}px`,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
    'fontSize': theme.typography.fontSize * 0.875,
  },
}))

const useTabIndicatorStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '1px',
    bottom: '0',
    position: 'absolute',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: theme.palette.tertiary.main,
  },
}))

const getWidthFromRef = (ref) =>
  ref && ref.current != null ? ReactDOM.findDOMNode(ref.current).getBoundingClientRect().width : 0

const calculateLeft = (refs, currentTabIndex, padding) =>
  _.sum(refs.slice(0, currentTabIndex).map(getWidthFromRef)) + padding

const TAB_INDICATOR_PROPS = {style: {height: 0}}
const TAB_INDICATOR_WIDTH = 0.5

const getCurrentTabIndicatorWidth = (ref, padding) =>
  (getWidthFromRef(ref) - padding * 2) * TAB_INDICATOR_WIDTH

export const LiteTabs = ({children, ...props}) => {
  const indicatorClassName = useTabIndicatorStyles().root
  const theme = useTheme()
  // https://stackoverflow.com/questions/54633690
  // This seems to me like escape hatch for looping over useRef
  const childrenRefs = useRef([...Array(children.length)].map(() => React.createRef())).current

  // attach refs to <Tab> children
  children = React.Children.map(children, (child, i) =>
    React.cloneElement(child, {ref: childrenRefs[i]})
  )
  const [indicatorLocation, setIndicatorLocation] = useState({left: 0, width: 0})

  const PADDING = getPadding(theme)
  const currentTabIndex = props.value

  useEffect(() => {
    const currentTabRef = childrenRefs[currentTabIndex]
    setIndicatorLocation({
      left: calculateLeft(childrenRefs, currentTabIndex, PADDING),
      width: getCurrentTabIndicatorWidth(currentTabRef, PADDING),
    })
  }, [PADDING, childrenRefs, currentTabIndex, setIndicatorLocation])

  const indicator = (
    <div
      style={{width: indicatorLocation.width, left: indicatorLocation.left}}
      className={indicatorClassName}
    />
  )

  return (
    <MuiTabs TabIndicatorProps={TAB_INDICATOR_PROPS} textColor="primary" {...props}>
      {children}
      {indicator}
    </MuiTabs>
  )
}

export const LiteTab = React.forwardRef(({...props}, ref) => {
  const classes = useTabStyles()
  return (
    <MuiTab
      classes={classes}
      ref={ref}
      disableRipple
      disableTouchRipple
      fullWidth={false}
      {...props}
    />
  )
})
