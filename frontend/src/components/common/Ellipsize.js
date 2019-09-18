import React from 'react'
import cn from 'classnames'
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

const Ellipsize = ({xs, sm, md, lg, xl, className, value}) => {
  const normalizedConfig = normalizeConfig({xs, sm, md, lg, xl})
  const currentBreakpoint = useCurrentBreakpoint()
  const cnt = normalizedConfig[currentBreakpoint]

  return <EllipsisDecisionMaker {...{cnt, className, value}} />
}

export default Ellipsize
