// @flow

import {useTheme} from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import mediaQuery from 'css-mediaquery'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// TODO: guess device width from userAgent
const ssrMatchMedia = (query) => {
  const res = mediaQuery.match(query, {
    // Note(ppershing): for now we assume desktop layout on server side render
    width: 1500,
  })
  return {
    media: query,
    matches: res,
  }
}

// Taken from official material docs
// https://material-ui.com/layout/use-media-query/#migrating-from-withwidth
export const useCurrentBreakpoint = () => {
  const theme = useTheme()
  const width =
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      // eslint-disable-next-line
      const matches = useMediaQuery(theme.breakpoints.only(key), {ssrMatchMedia})

      return !output && matches ? key : output
    }, null) || 'xs'

  return width
}

export const useIsBreakpointDown = (breakpoint: Breakpoint) => {
  const theme = useTheme()

  // Note: we use `breakpoints.up` because `breakpoint.down` uses '<=' comparison,
  // but '<' seems more reasonable
  const isUp = useMediaQuery(theme.breakpoints.up(breakpoint), {ssrMatchMedia})
  return !isUp
}

// This is the breakpoint we use to change navbar and most of desktop/mobile layout
export const useIsMobile = () => useIsBreakpointDown('md')
