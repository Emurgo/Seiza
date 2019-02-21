import React from 'react'
import {Grid, CircularProgress} from '@material-ui/core'

const LoadingInProgress = () => (
  <Grid container direction="row" justify="center">
    <CircularProgress />
  </Grid>
)

export default LoadingInProgress
