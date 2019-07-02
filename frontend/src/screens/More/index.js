import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {SimpleLayout} from '@/components/visual'
import {Link} from '@/components/common'
import MarketHistory from './MarketData'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  stakingKeyScreens: 'Staking Key screens',
  userStakingKeyScreen: 'User staking key',
  stakePoolProfileScreen: 'Stakepool profile screen',
})

const useStyles = makeStyles((theme) => ({
  graphWrapper: {
    height: 600,
    background: 'white', // TODO: temporary
    borderRadius: '5px',
  },
}))

const More = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <SimpleLayout title="Market data i18n">
      <Typography variant="h4">{tr(messages.stakingKeyScreens)}</Typography>
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
      <div className={classes.graphWrapper}>
        <MarketHistory />
      </div>
    </SimpleLayout>
  )
}

export default More
