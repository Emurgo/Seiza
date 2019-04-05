import React from 'react'
import {Grid, CircularProgress} from '@material-ui/core'

const LoadingInProgress = ({size = 40}) => (
  <Grid container direction="row" justify="center">
    <CircularProgress size={size} />
  </Grid>
)

export default LoadingInProgress
