import React from 'react'
import cn from 'classnames'
import {Grid, withStyles, createStyles} from '@material-ui/core'
import EntityHeading from './EntityHeading'

const styles = ({palette, spacing}) =>
  createStyles({
    container: {
      paddingTop: spacing.unit * 2.5,
      paddingBottom: spacing.unit * 7,
    },
    titleWrapper: {
      margin: spacing.unit * 4,
    },
    title: {
      'margin': spacing.unit * 3,
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
      // Note: using Grid Container requires always properly setting Grid, otherwise
      // there are some "strange offsets" in layout. Using only flex should be quick
      // workaround, before some major refactor.
      'display': 'flex',
      'flexDirection': 'column',
      '& > *': {
        marginBottom: spacing.unit * 2.5,
        width: '100%',
      },
    },
  })

const SimpleLayout = ({title, classes, children, className, maxWidth = '1500px'}) => (
  <Grid
    container
    className={cn(classes.container, className)}
    direction="row"
    justify="space-around"
  >
    <div style={{width: '85vw', maxWidth}}>
      <Grid container direction="row" justify="center">
        <div className={classes.titleWrapper}>
          <EntityHeading>{title}</EntityHeading>
        </div>
      </Grid>
      <div className={classes.childrenContainer}>{children}</div>
    </div>
  </Grid>
)

export default withStyles(styles)(SimpleLayout)
