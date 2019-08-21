// @flow
import React, {useRef} from 'react'

import {makeStyles} from '@material-ui/styles'

import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import Header from './Header'
import {StakeListLayout} from '../StakeList'
import {Search} from '../StakeList/SearchAndFilterBar'
import StakepoolCard from './StakepoolCard'
import {StakingContextProvider} from '../context'

const useStyles = makeStyles((theme) => ({
  centerWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    minWidth: 0, // needed for proper ellipsize in children components with flex
  },
  centeredItem: {
    maxWidth: 1000,
    width: '100%',
    padding: `${theme.spacing(6)}px ${theme.spacing(2)}px`,
  },
}))

export default () => {
  const classes = useStyles()
  const scrollToRef = useRef(null)

  useScrollFromBottom(scrollToRef, true)

  return (
    <React.Fragment>
      <Header />
      <div ref={scrollToRef}>
        <StakingContextProvider autoSync={false}>
          <div className={classes.centerWrapper}>
            <div className={classes.centeredItem}>
              <StakeListLayout StakepoolCard={StakepoolCard} TopBar={Search} />
            </div>
          </div>
        </StakingContextProvider>
      </div>
    </React.Fragment>
  )
}
