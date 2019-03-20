import React from 'react'
import {defineMessages} from 'react-intl'

import {SimpleLayout, Link} from '@/components/visual'
import MarketHistory from './MarketData'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  stakingKeyScreens: 'Staking Key screens',
  userStakingKeyScreen: 'User staking key',
  stakePoolProfileScreen: 'Stakepool profile screen',
})

const More = () => {
  const {translate: tr} = useI18n()
  return (
    <SimpleLayout title="Market data i18n">
      <h1>{tr(messages.stakingKeyScreens)}</h1>
      <Link
        to={routeTo.stakingKey.user(
          'c4ca4238a0b923820dcc509a6f75849bc81e728d9d4c2f636f067f89cc14862c'
        )}
      >
        {tr(messages.userStakingKeyScreen)}
      </Link>
      <Link
        to={routeTo.stakingKey.stakePool(
          'eccbc87e4b5ce2fe28308fd9f2a7baf3a87ff679a2f3e71d9181a67b7542122c'
        )}
      >
        {tr(messages.stakePoolProfileScreen)}
      </Link>
      <div style={{height: 600}}>
        <MarketHistory />
      </div>
    </SimpleLayout>
  )
}

export default More
