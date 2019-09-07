import React from 'react'

import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {MobilePaginationDivider} from '@/components/common'
import {useIsMobile} from '@/components/hooks/useBreakpoints'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  pagination: {
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
      width: 'auto',
    },
  },
  tabs: {
    maxWidth: '100%',
  },
}))

const TabsPaginationLayout = ({tabs, pagination}) => {
  const classes = useStyles()
  const isMobile = useIsMobile()
  return (
    <Grid container className={classes.wrapper}>
      <Grid item className={classes.tabs}>
        <div className="flex-grow-1">{tabs}</div>
      </Grid>
      <Grid item className={classes.pagination}>
        {isMobile && <MobilePaginationDivider />}
        {pagination}
      </Grid>
    </Grid>
  )
}

export default TabsPaginationLayout
