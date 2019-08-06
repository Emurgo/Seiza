import React from 'react'

import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  headerPagination: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}))

const TabsPaginationLayout = ({tabs, pagination}) => {
  const classes = useStyles()
  return (
    <Grid container className={classes.headerWrapper}>
      <Grid item>{tabs}</Grid>
      <Grid item className={classes.headerPagination}>
        {pagination}
      </Grid>
    </Grid>
  )
}

export default TabsPaginationLayout
