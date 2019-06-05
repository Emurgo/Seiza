import React from 'react'
import NoSSR from 'react-no-ssr'
import FrontendApp from '@/App'
const Index = () => {
  // TODO: Incrementally switch to next router and remove NoSSR
  return (
    <NoSSR>
      <FrontendApp />
    </NoSSR>
  )
}

export default Index
