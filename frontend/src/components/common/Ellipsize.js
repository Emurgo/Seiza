import React from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'

import {useCurrentBreakpoint} from '@/components/hooks/useBreakpoints'
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

const Ellipsize = ({xsCount, smCount, mdCount, lgCount, xlCount, className, value}) => {
  const normalizedConfig = normalizeConfig({
    xs: xsCount,
    sm: smCount,
    md: mdCount,
    lg: lgCount,
    xl: xlCount,
  })
  const currentBreakpoint = useCurrentBreakpoint()
  const charactersCount = normalizedConfig[currentBreakpoint]

  return <EllipsisDecisionMaker {...{charactersCount, className, value}} />
}

export default Ellipsize
