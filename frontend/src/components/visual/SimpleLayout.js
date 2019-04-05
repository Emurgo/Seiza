import React from 'react'
import {Grid, Typography, withStyles, createStyles} from '@material-ui/core'

const styles = ({palette, spacing}) =>
  createStyles({
    container: {
      paddingTop: spacing.unit * 2.5,
      paddingBottom: spacing.unit * 7,
    },
    titleWrapper: {
      position: 'relative',
      margin: spacing.unit * 4,
    },
    title: {
      'marginBottom': spacing.unit * 2.5,
      '&:after': {
        content: '""',
        background: palette.text.secondary,
        position: 'absolute',
        bottom: 12,
        left: '25%',
        right: '25%',
        width: '50%',
        height: '1px',
      },
    },
    childrenContainer: {
      '& > *': {
        marginBottom: spacing.unit * 2.5,
        width: '100%',
      },
    },
  })

const SimpleLayout = ({title, classes, children, maxWidth = '1500px'}) => (
  <Grid container className={classes.container} direction="row" justify="space-around">
    <div style={{width: '85%', maxWidth}}>
      <Grid container direction="row" justify="center">
        <div className={classes.titleWrapper}>
          <Typography className={classes.title} align="justify" variant="h2" color="textSecondary">
            {title}
          </Typography>
        </div>
      </Grid>
      <Grid container className={classes.childrenContainer} direction="column" spacing={16}>
        {children}
      </Grid>
    </div>
  </Grid>
)

export default withStyles(styles)(SimpleLayout)
