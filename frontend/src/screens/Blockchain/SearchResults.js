// @flow

import React, {useEffect} from 'react'
import useReactRouter from 'use-react-router'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useUrlManager} from '@/components/hooks/useUrlManager'
import {LoadingInProgress} from '@/components/visual'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    minHeight: '200px',
  },
}))

// Redirect to path taken from query
// This hacks re-fetching the data when searching for the same resource,
// (the one that is currently being viewed)
const SearchResult = () => {
  const {history, location} = useReactRouter()
  const {getQueryParam} = useUrlManager()
  const classes = useStyles()

  const redirectTo = getQueryParam('redirectTo', location.query)

  useEffect(() => {
    history.replace(redirectTo)
  }, [history, redirectTo])

  return (
    <Grid container justify="center" alignItems="center" className={classes.wrapper}>
      <LoadingInProgress />
    </Grid>
  )
}

export default SearchResult
