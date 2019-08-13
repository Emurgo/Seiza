import React from 'react'
import FrontendApp from '@/App'

const Index = ({routerCtx}) => {
  // TODO: Incrementally switch to next router and remove NoSSR
  return <FrontendApp routerCtx={routerCtx} />
}

export default Index
