// @flow
import React from 'react'

import config from '@/config'
import analytics from '@/helpers/googleAnalytics'
import BlockchainHeader from '@/screens/Blockchain/BlockchainHeader'
import GeneralInfo from './GeneralInfo'
import StakePoolsInfo from './StakePoolsInfo'
import Charts from './Charts'

import SyncIssuesBar from '@/components/common/SyncIssuesBar'

export default () => {
  analytics.useTrackPageVisitEvent('home')
  return (
    <React.Fragment>
      <BlockchainHeader />
      <SyncIssuesBar />
      <Charts />
      {config.showStakingData && <StakePoolsInfo />}
      <GeneralInfo />
    </React.Fragment>
  )
}
