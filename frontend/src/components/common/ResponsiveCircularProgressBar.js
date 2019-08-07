// @flow
import React from 'react'
import type {ComponentType} from 'react'
import CircularProgressBar from '@/components/visual/CircularProgressBar'
import type {ExternalProps} from '@/components/visual/CircularProgressBar'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const ResponsiveCircularProgressBar: ComponentType<ExternalProps> = (props) => {
  const isMobile = useIsMobile()
  return <CircularProgressBar size={isMobile ? 75 : 85} {...props} />
}

export default ResponsiveCircularProgressBar
