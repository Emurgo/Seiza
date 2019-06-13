// @flow

import {useTheme} from '@material-ui/styles'
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Taken from official material docs
// https://material-ui.com/layout/use-media-query/#migrating-from-withwidth
export const useCurrentBreakpoint = () => {
  const theme = useTheme()
  const width =
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      // eslint-disable-next-line
      const matches = useMediaQuery(theme.breakpoints.only(key))

      return !output && matches ? key : output
    }, null) || 'xs'

  return width
}

export const useIsBreakpointDown = (breakpoint: Breakpoint) => {
  const theme = useTheme()

  // Note: we use `breakpoints.up` because `breakpoint.down` uses '<=' comparison,
  // but '<' seems more reasonable
  const isUp = useMediaQuery(theme.breakpoints.up(breakpoint))
  return !isUp
}

// This is the breakpoint we use to change navbar and most of desktop/mobile layout
export const useIsMobile = () => useIsBreakpointDown('md')
