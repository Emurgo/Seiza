import React from 'react'
import {SimpleLayout} from '@/components/visual'
import MarketHistory from './MarketData'

const More = () => {
  return (
    <SimpleLayout title="Market data i18n">
      <div style={{height: 600}}>
        <MarketHistory />
      </div>
    </SimpleLayout>
  )
}

export default More
