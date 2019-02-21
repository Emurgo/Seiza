import React from 'react'
import {Grid, Typography, withStyles, createStyles} from '@material-ui/core'

const styles = ({palette}) =>
  createStyles({
    container: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
    title: {
      color: palette.grey[600],
      borderBottom: `1px solid ${palette.grey[600]}`,
    },
  })

const SimpleLayout = ({title, classes, children, width = '1500px'}) => (
  <Grid container className={classes.container} direction="row" justify="space-around">
    <div style={{width}}>
      <Grid container direction="row" justify="center">
        <Typography className={classes.title} align="justify" variant="h4">
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
