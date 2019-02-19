// @flow
import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Paper,
  TableFooter,
  withStyles,
} from '@material-ui/core'
import {compose} from 'redux'

import Pagination from './Pagination'

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
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
})

export default compose(
  withStyles(tableStyles),
)(
  ({
    i18n,
    classes,
    page,
    onChangePage,
    totalCount,
    rowsPerPage,
    paggingInfoFormatter,
    rowsPerPageOptions,
    headerData,
    bodyData,
    hideHead,
    disableRowStyles,
  }) => (
    <Paper className={classes.root}>
      <Table>
        <TableHead className={classes.head}>
          <TR>
            {headerData.map((item, index) => (
              <TD key={index} align="left">{item}</TD>
            ))}
          </TR>
        </TableHead>
        <TableBody>
          {bodyData.map((row, outerIndex) => (
            <TR key={outerIndex} className={classes.row}>
              {row.map((item, innerIndex) => (
                <TD key={innerIndex} align="left">{item}</TD>
              ))}
            </TR>
          ))}
        </TableBody>
        <TableFooter>
          <TR>
            <TD colSpan={headerData.length}>
              <Pagination
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={onChangePage}
              />
            </TD>
          </TR>
        </TableFooter>
      </Table>
    </Paper>
  )
)
