//@flow
import {useTheme} from '@material-ui/styles'
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const useIsBreakpointDown = (breakpoint: Breakpoint) => {
  const theme = useTheme()
  const isDown = useMediaQuery(theme.breakpoints.down(breakpoint))
  return isDown
}

export default useIsBreakpointDown
