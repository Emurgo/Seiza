// @flow
import React, {useRef} from 'react'

import {makeStyles} from '@material-ui/styles'

import {DesktopOnly} from '@/components/visual'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import Header from './Header'
import {StakeListLayout} from '../StakeList'
import {SimpleStakingTopBar} from '../StakeList/SearchAndFilterBar'
import StakepoolCard from './StakepoolCard'
import {StakingContextProvider} from '../context'
import {CARD_WIDTH} from '../StakeList/stakepoolCardUtils'

const useStyles = makeStyles((theme) => ({
  centerWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    minWidth: 0, // needed for proper ellipsize in children components with flex
  },
  centeredItem: {
    maxWidth: CARD_WIDTH,
    width: '100%',
    padding: `${theme.spacing(3)}px 0px`,
  },
}))

export default () => {
  const classes = useStyles()
  const scrollToRef = useRef(null)

  useScrollFromBottom(scrollToRef, true)

  return (
    <React.Fragment>
      <DesktopOnly>
        <Header />
      </DesktopOnly>
      <div ref={scrollToRef}>
        <StakingContextProvider autoSync={false}>
          <div className={classes.centerWrapper}>
            <div className={classes.centeredItem}>
              <StakeListLayout StakepoolCard={StakepoolCard} TopBar={SimpleStakingTopBar} />
            </div>
          </div>
        </StakingContextProvider>
      </div>
    </React.Fragment>
  )
}
