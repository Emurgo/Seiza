import React from 'react'

import MetricsCard from '../../components/visual/MetricsCard'

const Blockchain = () => {
  return (
    <React.Fragment>
      <h1>Home</h1>
      {/* temporary example*/}
      <MetricsCard icon="blocks" value="-1" metric="Blocks" />
    </React.Fragment>
  )
}

export default Blockchain
