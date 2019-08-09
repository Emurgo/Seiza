// @flow

import React from 'react'

import {makeStyles} from '@material-ui/styles'

import Header from './Header'
import StakeList from '../StakeList'
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

// TODO: decide how links to that screen should look like (mobile)
// TODO: use different stake pool cards with StakeList
export default () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Header />
      <StakingContextProvider autoSync={false}>
        <div className={classes.centerWrapper}>
          <div className={classes.centeredItem}>
            <StakeList />
          </div>
        </div>
      </StakingContextProvider>
    </React.Fragment>
  )
}
