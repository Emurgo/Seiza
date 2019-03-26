// @flow
import React from 'react'

import BlockchainHeader from '@/screens/Blockchain/BlockchainHeader'
import GeneralInfo from './GeneralInfo'
import StakePoolsInfo from './StakePoolsInfo'

export default () => (
  <React.Fragment>
    <BlockchainHeader />
    <StakePoolsInfo />
    <GeneralInfo />
  </React.Fragment>
)
