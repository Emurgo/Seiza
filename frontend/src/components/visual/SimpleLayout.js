import React from 'react'
import {Grid, Typography, withStyles, createStyles} from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    content: {
      width: '1000px',
    },
  })

const SimpleLayout = ({title, classes, children}) => (
  <Grid container direction="row" justify="space-around">
    <div className={classes.content}>
      <Grid container direction="row" justify="space-around">
        <Typography align="justify" variant="h2">
          {title}
        </Typography>
      </Grid>
      <Grid direction="column" spacing={16}>
        {children}
      </Grid>
    </div>
  </Grid>
)

export default withStyles(styles)(SimpleLayout)
