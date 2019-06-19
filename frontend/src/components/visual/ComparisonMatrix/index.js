// @flow

import React from 'react'

import {useIsMobile} from '@/components/hooks/useBreakpoints'

import MobileComparisonMatrix from './MobileComparisonMatrix'
import DesktopComparisonMatrix from './DesktopComparisonMatrix'

import type {ComparisonMatrixProps} from './types'

export default (props: ComparisonMatrixProps) => {
  const isMobile = useIsMobile()
  return isMobile ? <MobileComparisonMatrix {...props} /> : <DesktopComparisonMatrix {...props} />
}
