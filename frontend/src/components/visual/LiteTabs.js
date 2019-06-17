import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import idx from 'idx'
import assert from 'assert'
import cn from 'classnames'
import {Tabs as MuiTabs, Tab as MuiTab} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {mergeStylesheets} from '@/helpers/styles'

export const getPadding = (theme) => theme.spacing(3)
const useTabStyles = makeStyles((theme) => ({
  root: {
    minWidth: 'initial',
    minHeight: 'initial',
    padding: `0px ${getPadding(theme)}px`,
  },
  wrapper: {
    'padding': 0,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
    'fontSize': theme.typography.fontSize * 0.875,
  },
}))

const useTabsStyles = makeStyles((theme) => ({
  root: {
    // need to have for indicator correctly under labels
    minHeight: 'auto !important',
    // minHeight is set by default to 48px in material-ui
    // 'auto' makes it 24px,
    // so we apply remaining 24px to bottom
    marginBottom: ({defaultBottomOffset}) => (defaultBottomOffset ? 24 : 0),
  },
  flexContainer: {
    '& > :first-child': {
      // Needed for scrolling
      paddingLeft: 0,
    },
  },
  scrollButtonsDesktop: {
    [theme.breakpoints.down('xs')]: {
      // override default behavior which is to hide
      display: 'block !important',
    },
  },
}))

const useWrapperStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },
}))

const useTabIndicatorStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    width: '100%',
    height: '1px',
    bottom: '0',
    position: 'absolute',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: theme.palette.tertiary.main,
  },
}))

const labelNodeFromTabNode = (node) => idx(node, (_) => _.children[0])

const TAB_INDICATOR_PROPS = {style: {height: 0}}
const TAB_INDICATOR_WIDTH = 0.5

const calculateTabIndicatorPosition = (tabRef) => {
  const tabNode = ReactDOM.findDOMNode(tabRef.current)
  const labelNode = labelNodeFromTabNode(tabNode)

  const left = labelNode && labelNode.offsetLeft + labelNode.parentElement.offsetLeft
  const width = labelNode && labelNode.parentElement.offsetWidth
  return {
    left: left || 0,
    width: (width || 0) * TAB_INDICATOR_WIDTH,
  }
}

export const LiteTabs = ({children, defaultBottomOffset, ...props}) => {
  const classes = useWrapperStyles()
  const tabsClasses = useTabsStyles({defaultBottomOffset})
  const indicatorClassName = useTabIndicatorStyles().root

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
    const {left, width} = calculateTabIndicatorPosition(currentTabRef)
    if (indicatorLocation.left !== left || indicatorLocation.width !== width) {
      setIndicatorLocation({left, width})
    }
  }, [childrenRefs, currentTabIndex, indicatorLocation, setIndicatorLocation])

  const indicator = <div style={{...indicatorLocation}} className={indicatorClassName} />

  return (
    <div className={cn(props.className, classes.wrapper)}>
      <MuiTabs
        TabIndicatorProps={TAB_INDICATOR_PROPS}
        classes={mergeStylesheets(tabsClasses, props.classes)}
        textColor="primary"
        variant="scrollable"
        buttons="auto"
        {...props}
      >
        {children}
        {indicator}
      </MuiTabs>
    </div>
  )
}

export const LiteTab = React.forwardRef(({...props}, ref) => {
  const classes = useTabStyles()
  return <MuiTab classes={classes} ref={ref} disableTouchRipple fullWidth={false} {...props} />
})
