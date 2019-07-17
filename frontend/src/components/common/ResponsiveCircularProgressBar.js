// @flow
import React from 'react'

import CircularProgressBar from '@/components/visual/CircularProgressBar'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

import type {ExternalProps} from '@/components/visual/CircularProgressBar'
import type {ComponentType} from 'react'

const ResponsiveCircularProgressBar: ComponentType<ExternalProps> = (props) => {
  const isMobile = useIsMobile()
  return (
    <CircularProgressBar
      height={isMobile ? 40 : 85}
      width={isMobile ? 100 : 85}
      textAlign={isMobile ? 'left' : 'middle'}
      {...props}
    />
  )
}

export default ResponsiveCircularProgressBar
