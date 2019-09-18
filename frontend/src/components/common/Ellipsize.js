import React from 'react'
import cn from 'classnames'
import {Hidden, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useCurrentBreakpoint} from '@/components/hooks/useBreakpoints'
import EllipsizeMiddle from '@/components/visual/EllipsizeMiddle'

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']

const useStyles = makeStyles(({typography}) => ({
  ellipsize: {
    ...typography._ellipsize,
  },
}))

const DEFAULT_XS_COUNT = 6
const normalizeConfig = (config) => {
  return BREAKPOINTS.reduce(
    (acc, current, index) => {
      acc[current] = config[current] || (index > 1 ? acc[BREAKPOINTS[index - 1]] : DEFAULT_XS_COUNT)
      return acc
    },
    {xs: 0, sm: 0, md: 0, lg: 0, xl: 0}
  )
}

const EllipsisDecisionMaker = ({cnt, className, value}) => {
  const classes = useStyles()
  return cnt === 'auto' ? (
    <span className={cn(classes.ellipsize, className)}>{value}</span>
  ) : (
    <EllipsizeMiddle className={className} startCharsCnt={cnt} endCharsCnt={cnt} value={value} />
  )
}

const Show = ({only, children}) => {
  if (only === 'xs') {
    return (
      <Box display={{xs: 'inherit', sm: 'none'}} implementation="css">
        {children}
      </Box>
    )
  } else if (only === 'sm') {
    return (
      <Box display={{xs: 'none', sm: 'inherit', md: 'none'}} implementation="css">
        {children}
      </Box>
    )
  } else if (only === 'md') {
    return (
      <Box display={{xs: 'none', md: 'inherit', lg: 'none'}} implementation="css">
        {children}
      </Box>
    )
  } else if (only === 'lg') {
    return (
      <Box display={{xs: 'none', lg: 'inherit', xl: 'none'}} implementation="css">
        {children}
      </Box>
    )
  } else if (only === 'xl') {
    return (
      <Box display={{xs: 'none', xl: 'inherit'}} implementation="css">
        {children}
      </Box>
    )
  }
  return children
}

const Ellipsize = ({xs, sm, md, lg, xl, className, value}) => {
  const normalizedConfig = normalizeConfig({xs, sm, md, lg, xl})

  return (
    <React.Fragment>
      <Show only="xs">
        <EllipsisDecisionMaker {...{cnt: normalizedConfig.xs, className, value}} />
      </Show>
      <Show only="sm">
        <EllipsisDecisionMaker {...{cnt: normalizedConfig.sm, className, value}} />
      </Show>
      <Show only="md">
        <EllipsisDecisionMaker {...{cnt: normalizedConfig.md, className, value}} />
      </Show>
      <Show only="lg">
        <EllipsisDecisionMaker {...{cnt: normalizedConfig.lg, className, value}} />
      </Show>
      <Show only="xl">
        <EllipsisDecisionMaker {...{cnt: normalizedConfig.xl, className, value}} />
      </Show>
    </React.Fragment>
  )
}

export default Ellipsize
