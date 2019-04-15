// @flow
import React from 'react'

import config from '@/config'
import BlockchainHeader from '@/screens/Blockchain/BlockchainHeader'
import GeneralInfo from './GeneralInfo'
import StakePoolsInfo from './StakePoolsInfo'
import Charts from './Charts'

export default () => (
  <React.Fragment>
    <BlockchainHeader />
    <Charts />
    {config.showStakingData && <StakePoolsInfo />}
    <GeneralInfo />
  </React.Fragment>
)
