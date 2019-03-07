// @flow
import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Paper,
  Typography,
  Fade,
  Grid,
  withStyles,
} from '@material-ui/core'
import {compose} from 'redux'
import LoadingInProgress from './LoadingInProgress'

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    position: 'relative',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    'cursor': 'pointer',
  },
  head: {
    textTransform: 'uppercase',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    background: 'rgba(0, 0, 0, 0.1)',
  },
})

export default compose(withStyles(tableStyles))(
  ({i18n, classes, headerData, bodyData, noDataText, loading}) => (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead className={classes.head}>
          <TR>
            {headerData.map((item, index) => (
              <TD key={index} align="left">
                {item}
              </TD>
            ))}
          </TR>
        </TableHead>
        <TableBody>
          {bodyData ? (
            bodyData.map((row, outerIndex) => (
              <TR key={outerIndex} className={classes.row}>
                {row.map((item, innerIndex) => (
                  <TD key={innerIndex} align="left">
                    {item}
                  </TD>
                ))}
              </TR>
            ))
          ) : (
            <TR>
              <TD colspan={headerData.length}>
                <Grid container justify="space-around" direction="row">
                  <Typography variant="caption">{noDataText}</Typography>
                </Grid>
              </TD>
            </TR>
          )}
          {loading && (
            <Fade in timeout={{enter: 1500, exit: 0}}>
              <div className={classes.loadingOverlay}>
                <LoadingInProgress />
              </div>
            </Fade>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
)
