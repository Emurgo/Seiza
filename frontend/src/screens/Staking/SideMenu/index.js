// @flow

import React from 'react'
import PoolsToCompare from './PoolsToCompare'
import NavigationBar from './NavigationBar'

export default () => (
  <React.Fragment>
    {/* TODO: use real data, probably stored in context */}
    <PoolsToCompare stakePools={['poolname1', 'poolname2', 'poolname3']} />
    <NavigationBar />
  </React.Fragment>
)
