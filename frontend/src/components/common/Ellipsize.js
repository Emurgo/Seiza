import React from 'react'
import cn from 'classnames'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import EllipsizeMiddle from '@/components/visual/EllipsizeMiddle'

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']

const useStyles = makeStyles(({typography}) => ({
  ellipsize: typography._ellipsize,
}))

const DEFAULT_XS_COUNT = 6
// normalizes, i.e. when caller provides
// {xsCount:6, lgCount: 8},
// fills to {xsCount: 6, smCount: 6, mdCount:6, lgCount:8, lgCount:8}
const normalizeConfig = (config) => {
  return BREAKPOINTS.reduce((acc, current, index) => {
    acc[current] = config[current] || (index > 1 ? acc[BREAKPOINTS[index - 1]] : DEFAULT_XS_COUNT)
    return acc
  }, {})
}

const EllipsisDecisionMaker = ({charactersCount, className, value}) => {
  const classes = useStyles()
  return charactersCount === 'ellipsizeEnd' ? (
    <span className={cn(classes.ellipsize, className)}>{value}</span>
  ) : (
    <EllipsizeMiddle
      className={className}
      startCharsCnt={charactersCount}
      endCharsCnt={charactersCount}
      value={value}
    />
  )
}

// display: inherit is needed
const onlyXs = {xs: 'inherit', sm: 'none'}
const onlySm = {xs: 'none', sm: 'inherit', md: 'none'}
const onlyMd = {xs: 'none', md: 'inherit', lg: 'none'}
const onlyLg = {xs: 'none', lg: 'inherit', xl: 'none'}
const onlyXl = {xs: 'none', xl: 'inherit'}

const SHOW_ONLY = {
  xs: ({children}) => (
    <Box display={onlyXs} implementation="css">
      {children}
    </Box>
  ),
  sm: ({children}) => (
    <Box display={onlySm} implementation="css">
      {children}
    </Box>
  ),
  md: ({children}) => (
    <Box display={onlyMd} implementation="css">
      {children}
    </Box>
  ),
  lg: ({children}) => (
    <Box display={onlyLg} implementation="css">
      {children}
    </Box>
  ),
  xl: ({children}) => (
    <Box display={onlyXl} implementation="css">
      {children}
    </Box>
  ),
}

const Show = ({only, children}) => {
  const Component = SHOW_ONLY[only]
  return Component ? <Component>{children}</Component> : children
}

const Ellipsize = ({xsCount, smCount, mdCount, lgCount, xlCount, className, value}) => {
  const normalizedConfig = normalizeConfig({
    xs: xsCount,
    sm: smCount,
    md: mdCount,
    lg: lgCount,
    xl: xlCount,
  })

  return (
    <React.Fragment>
      <Show only="xs">
        <EllipsisDecisionMaker {...{charactersCount: normalizedConfig.xs, className, value}} />
      </Show>
      <Show only="sm">
        <EllipsisDecisionMaker {...{charactersCount: normalizedConfig.sm, className, value}} />
      </Show>
      <Show only="md">
        <EllipsisDecisionMaker {...{charactersCount: normalizedConfig.md, className, value}} />
      </Show>
      <Show only="lg">
        <EllipsisDecisionMaker {...{charactersCount: normalizedConfig.lg, className, value}} />
      </Show>
      <Show only="xl">
        <EllipsisDecisionMaker {...{charactersCount: normalizedConfig.xl, className, value}} />
      </Show>
    </React.Fragment>
  )
}

export default Ellipsize
