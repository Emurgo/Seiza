// @flow

import React from 'react'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import PoolsToCompare from './PoolsToCompare'
import ActionsBar from './ActionsBar'
import {useSelectedPoolsContext} from '../../context/selectedPools'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: '20px 40px 20px 60px',
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
  },
}))

const SettingsBar = () => {
  const classes = useStyles()
  const {selectedPools: selectedPoolsHashes} = useSelectedPoolsContext()

  return (
    <Grid container className={classes.wrapper} direction="row">
      <PoolsToCompare selectedPoolsHashes={selectedPoolsHashes} />
      <ActionsBar selectedPoolsHashes={selectedPoolsHashes} />
    </Grid>
  )
}

export default SettingsBar
