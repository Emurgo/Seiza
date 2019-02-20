// @flow
import React from 'react'

import OverviewMetrics from './OverviewMetrics'
import Search from './Search'

// TODO (rethink): it might be more appropriate to store Search in a Blockchain folder
export default () => (
  <div className="gradient-bg">
    <OverviewMetrics />
    <Search />
  </div>
)
