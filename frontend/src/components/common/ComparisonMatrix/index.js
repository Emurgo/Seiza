// @flow

import React from 'react'

import {useIsMobile} from '@/components/hooks/useBreakpoints'

import MobileComparisonMatrix from './MobileComparisonMatrix'
import DesktopComparisonMatrix from './DesktopComparisonMatrix'

import type {ComparisonMatrixProps} from './types'

const ComparisonMatrix = (props: ComparisonMatrixProps) => {
  const isMobile = useIsMobile()
  return isMobile ? <MobileComparisonMatrix {...props} /> : <DesktopComparisonMatrix {...props} />
}

ComparisonMatrix.whyDidYouRender = true

export default React.memo<ComparisonMatrixProps>(ComparisonMatrix)
