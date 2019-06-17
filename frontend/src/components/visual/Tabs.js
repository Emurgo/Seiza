import React from 'react'
import {Tab as MuiTab, Tabs as MuiTabs} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

// TODO: possibly we'll need to remove also ripple effect
const useTabsStyles = makeStyles(({palette}) => ({
  indicator: {
    height: '100%',
    opacity: 0.1,
  },
}))
const useTabStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    flexDirection: 'row',
    paddingBottom: `${spacing(4)}px`,
    paddingTop: `${spacing(3.25)}px`,
    borderBottom: `1px solid ${palette.contentUnfocus}`,
    letterSpacing: 1,
  },
  selected: {},
}))

export const Tabs = ({children, ...props}) => {
  const classes = useTabsStyles()
  return (
    <MuiTabs
      classes={classes}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      {...props}
    >
      {children}
    </MuiTabs>
  )
}

export const Tab = ({...props}) => {
  const classes = useTabStyles()
  return <MuiTab classes={classes} {...props} />
}
