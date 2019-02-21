import React from 'react'
import {Grid, Typography} from '@material-ui/core'

const DebugApolloError = ({error}) => {
  const formatted = JSON.stringify(error, null, 4)

  return (
    <Grid container direction="row" justify="center">
      <Typography component="pre">{formatted}</Typography>
    </Grid>
  )
}

export default DebugApolloError
