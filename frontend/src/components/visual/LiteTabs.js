import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import idx from 'idx'
import assert from 'assert'
import {Tabs as MuiTabs, Tab as MuiTab} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {mergeStylesheets} from '@/helpers/styles'

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

const useTabsStyles = makeStyles((theme) => ({
  root: {
    marginLeft: ({alignLeft}) => (alignLeft ? -getPadding(theme) : 'initial'),
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
  return labelNode != null ? labelNode.getBoundingClientRect() : {}
}

const rectFromRef = (ref) => {
  const node = ReactDOM.findDOMNode(ref.current)
  return node != null ? node.getBoundingClientRect() : {}
}

const calculateLeft = (tabsRef, tabRef) => {
  const tabsRect = rectFromRef(tabsRef)
  const tabLabelRect = labelRectFromTabRef(tabRef)
  return tabLabelRect.left - tabsRect.left || 0
}

const TAB_INDICATOR_PROPS = {style: {height: 0}}
const TAB_INDICATOR_WIDTH = 0.5

const getWidthOfCurrentTabIndicator = (tabLabelRef) =>
  (labelRectFromTabRef(tabLabelRef).width || 0) * TAB_INDICATOR_WIDTH

export const LiteTabs = ({children, alignLeft, ...props}) => {
  const classes = useTabsStyles({alignLeft})
  const indicatorClassName = useTabIndicatorStyles().root
  const tabsRef = useRef(null)

  // https://stackoverflow.com/questions/54633690
  // This seems to me like escape hatch for looping over useRef
  const childrenRefs = useRef(_.range(children.length).map(() => React.createRef())).current
  assert(
    childrenRefs.length === children.length,
    'LiteTabs support only constant length of children'
  )

  // attach refs to <Tab> children
  children = _.zip(children, childrenRefs).map(([child, ref]) => React.cloneElement(child, {ref}))

  const [indicatorLocation, setIndicatorLocation] = useState({left: 0, width: 0})

  const currentTabIndex = props.value

  useEffect(() => {
    const currentTabRef = childrenRefs[currentTabIndex]
    const left = calculateLeft(tabsRef, currentTabRef)
    const width = getWidthOfCurrentTabIndicator(currentTabRef)
    if (indicatorLocation.left !== left || indicatorLocation.width !== width) {
      setIndicatorLocation({left, width})
    }
  }, [childrenRefs, currentTabIndex, indicatorLocation, setIndicatorLocation])

  const indicator = <div style={{...indicatorLocation}} className={indicatorClassName} />

  return (
    <MuiTabs
      ref={tabsRef}
      TabIndicatorProps={TAB_INDICATOR_PROPS}
      classes={mergeStylesheets(classes, props.classes)}
      textColor="primary"
      {...props}
    >
      {children}
      {indicator}
    </MuiTabs>
  )
}

export const LiteTab = React.forwardRef(({...props}, ref) => {
  const classes = useTabStyles()
  return <MuiTab classes={classes} ref={ref} disableTouchRipple fullWidth={false} {...props} />
})
