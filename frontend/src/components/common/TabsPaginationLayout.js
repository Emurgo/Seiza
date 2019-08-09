import React from 'react'

import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {MobilePaginationDivider} from '@/components/common'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

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
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
      width: 'auto',
    },
  },
}))

const TabsPaginationLayout = ({tabs, pagination}) => {
  const classes = useStyles()
  const isMobile = useIsMobile()
  return (
    <Grid container className={classes.headerWrapper}>
      <Grid item>{tabs}</Grid>
      <Grid item className={classes.headerPagination}>
        {isMobile && <MobilePaginationDivider />}
        {pagination}
      </Grid>
    </Grid>
  )
}

export default TabsPaginationLayout
