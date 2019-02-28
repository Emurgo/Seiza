import React from 'react'
import {Grid, Typography, withStyles, createStyles} from '@material-ui/core'

const styles = ({palette, spacing}) =>
  createStyles({
    container: {
      paddingTop: spacing.unit * 2.5,
      paddingBottom: spacing.unit * 2.5,
    },
    title: {
      color: palette.grey[600],
      borderBottom: `1px solid ${palette.grey[600]}`,
      marginBottom: spacing.unit * 2.5,
    },
    childrenContainer: {
      '& > *': {
        marginBottom: spacing.unit * 2.5,
      },
    },
  })

const SimpleLayout = ({title, classes, children, maxWidth = '1500px'}) => (
  <Grid container className={classes.container} direction="row" justify="space-around">
    <div style={{width: '85%', maxWidth}}>
      <Grid container direction="row" justify="center">
        <Typography className={classes.title} align="justify" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid className={classes.childrenContainer} direction="column" spacing={16}>
        {children}
      </Grid>
    </div>
  </Grid>
)

export default withStyles(styles)(SimpleLayout)
