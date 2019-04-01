import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import idx from 'idx'
import {Tabs as MuiTabs, Tab as MuiTab} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

export const getPadding = (theme) => theme.spacing.unit * 3
const useTabStyles = makeStyles((theme) => ({
  root: {
    minWidth: 'initial',
    minHeight: 'initial',
    padding: `0px ${getPadding(theme)}px`,
  },
  labelContainer: {
    'padding': 0,
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

const labelNodeFromTabNode = (node) => idx(node, (_) => _.children[0])

const labelRectFromTabRef = (tabRef) => {
  const tabNode = ReactDOM.findDOMNode(tabRef.current)
  const labelNode = labelNodeFromTabNode(tabNode)
  return labelNode.getBoundingClientRect()
}

const rectFromRef = (ref) => ReactDOM.findDOMNode(ref.current).getBoundingClientRect()

const calculateLeft = (tabsRef, tabRef) => {
  const tabsRect = rectFromRef(tabsRef)
  const tabLabelRect = labelRectFromTabRef(tabRef)
  return tabLabelRect.left - tabsRect.left
}

const TAB_INDICATOR_PROPS = {style: {height: 0}}
const TAB_INDICATOR_WIDTH = 0.5

const getCurrentTabIndicatorWidth = (tabLabelRef) =>
  labelRectFromTabRef(tabLabelRef).width * TAB_INDICATOR_WIDTH

export const LiteTabs = ({children, ...props}) => {
  const indicatorClassName = useTabIndicatorStyles().root

  const tabsRef = useRef(null)

  // https://stackoverflow.com/questions/54633690
  // This seems to me like escape hatch for looping over useRef
  const childrenRefs = useRef(_.range(children.length).map(() => React.createRef())).current

  // attach refs to <Tab> children
  children = _.zip(children, childrenRefs).map(([child, ref]) => React.cloneElement(child, {ref}))

  const [indicatorLocation, setIndicatorLocation] = useState({left: 0, width: 0})

  const currentTabIndex = props.value

  useEffect(() => {
    const currentTabRef = childrenRefs[currentTabIndex]
    setIndicatorLocation({
      left: calculateLeft(tabsRef, currentTabRef),
      width: getCurrentTabIndicatorWidth(currentTabRef),
    })
  }, [childrenRefs, currentTabIndex, setIndicatorLocation])

  const indicator = <div style={{...indicatorLocation}} className={indicatorClassName} />

  return (
    <MuiTabs ref={tabsRef} TabIndicatorProps={TAB_INDICATOR_PROPS} textColor="primary" {...props}>
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
