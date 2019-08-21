// @flow
import React from 'react'

import {makeStyles} from '@material-ui/styles'

import Header from './Header'
import {StakeListLayout} from '../StakeList'
import {Search} from '../StakeList/SearchAndFilterBar'
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
    padding: `${theme.spacing(6)}px ${theme.spacing(2)}px`,
  },
}))

// TODO: decide how links to that screen should look like (mobile)
export default () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Header />
      <StakingContextProvider autoSync={false}>
        <div className={classes.centerWrapper}>
          <div className={classes.centeredItem}>
            <StakeListLayout StakepoolCard={StakepoolCard} TopBar={Search} />
          </div>
        </div>
      </StakingContextProvider>
    </React.Fragment>
  )
}
