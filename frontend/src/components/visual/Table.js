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
  Grid,
  withStyles,
} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {compose} from 'redux'

import Overlay from './Overlay'
import LoadingOverlay from './LoadingOverlay'
import ErrorOverlay from './ErrorOverlay'

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: darken(theme.palette.background.default, 0.07),
    },
    'cursor': 'pointer',
  },
  cell: {
    // Not sure why MaterialUi has in-consistent padding
    // Reset paddingRight to same value as paddingLeft
    paddingRight: '24px',
  },
  head: {
    textTransform: 'uppercase',
  },
})

export default compose(withStyles(tableStyles))(
  ({i18n, classes, headerData, bodyData, noDataText, loading, error}) => (
    <Paper elevation={6} className={classes.root}>
      <Overlay.Wrapper>
        <Table>
          <TableHead className={classes.head}>
            <TR>
              {headerData.map((item, index) => (
                <TD key={index} align="left" className={classes.cell}>
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
                    <TD key={innerIndex} align="left" className={classes.cell}>
                      {item}
                    </TD>
                  ))}
                </TR>
              ))
            ) : (
              <TR>
                <TD colSpan={headerData.length}>
                  <Grid container justify="space-around" direction="row">
                    <Typography variant="caption">{noDataText}</Typography>
                  </Grid>
                </TD>
              </TR>
            )}
          </TableBody>
        </Table>
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={error} />
      </Overlay.Wrapper>
    </Paper>
  )
)
