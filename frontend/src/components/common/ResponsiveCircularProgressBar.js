// @flow
import React from 'react'

import CircularProgressBar from '@/components/visual/CircularProgressBar'
import {DesktopOnly, MobileOnly} from '@/components/visual'

import type {ExternalProps} from '@/components/visual/CircularProgressBar'
import type {ComponentType} from 'react'

const ResponsiveCircularProgressBar: ComponentType<ExternalProps> = (props) => (
  <React.Fragment>
    <MobileOnly>
      <CircularProgressBar height={40} width={100} textAlign="left" {...props} />
    </MobileOnly>
    <DesktopOnly>
      <CircularProgressBar height={85} width={85} textAlign="middle" {...props} />
    </DesktopOnly>
  </React.Fragment>
)

export default ResponsiveCircularProgressBar
