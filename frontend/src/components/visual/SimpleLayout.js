import React from 'react'
import cn from 'classnames'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import EntityHeading from './EntityHeading'

const useStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  container: {
    paddingTop: spacing(2.5),
    paddingBottom: spacing(7),
  },
  titleWrapper: {
    margin: spacing(4),
  },
  title: {
    'margin': spacing(3),
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
  content: {
    // Pretty tight margins on mobile
    width: `calc(100vw - ${spacing(3)}px)`,
    [breakpoints.up('sm')]: {
      // Wide margins on desktop
      width: '85vw',
    },
  },
  childrenContainer: {
    // Note: using Grid Container requires always properly setting Grid, otherwise
    // there are some "strange offsets" in layout. Using only flex should be quick
    // workaround, before some major refactor.
    'display': 'flex',
    'flexDirection': 'column',
    '& > *': {
      marginBottom: spacing(2.5),
      width: '100%',
    },
  },
}))

const SimpleLayout = ({title, children, className, maxWidth = '1500px'}) => {
  const classes = useStyles()
  return (
    <Grid
      container
      className={cn(classes.container, className)}
      direction="row"
      justify="space-around"
    >
      <div className={classes.content} style={{maxWidth}}>
        <Grid container direction="row" justify="center">
          <div className={classes.titleWrapper}>
            <EntityHeading>{title}</EntityHeading>
          </div>
        </Grid>
        <div className={classes.childrenContainer}>{children}</div>
      </div>
    </Grid>
  )
}

export default SimpleLayout
