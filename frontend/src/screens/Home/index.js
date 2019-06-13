// @flow
import React, {useRef} from 'react'

import config from '@/config'
import {useAnalytics} from '@/helpers/googleAnalytics'
import GeneralInfo from './GeneralInfo'
import StakePoolsInfo from './StakePoolsInfo'
import Charts from './Charts'

import {useScrollFromBottom} from '@/hooks/useScrollFromBottom'

import SyncIssuesBar from '@/components/common/SyncIssuesBar'

export default () => {
  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('home')

  const scrollToRef = useRef(null)
  useScrollFromBottom(scrollToRef)

  return (
    <React.Fragment>
      <SyncIssuesBar />
      <div ref={scrollToRef}>
        <Charts />
      </div>
      {config.showStakingData && <StakePoolsInfo />}
      <GeneralInfo />
    </React.Fragment>
  )
}
