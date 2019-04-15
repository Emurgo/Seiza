// @flow

// $FlowFixMe flow does not know about this export
import {useTheme} from '@material-ui/styles'
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery'

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
