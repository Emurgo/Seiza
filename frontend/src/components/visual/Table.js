import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import MaterialTable from '@material-ui/core/Table'
import MaterialTableBody from '@material-ui/core/TableBody'
import MaterialTableCell from '@material-ui/core/TableCell'
import MaterialTableHead from '@material-ui/core/TableHead'
import MaterialTableRow from '@material-ui/core/TableRow'
import MaterialPaper from '@material-ui/core/Paper'

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700, // TODO: get proper constant
  },
})
const rowStyles = (theme) => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    'cursor': 'pointer',
  },
})
const headRowStyles = (theme) => ({})
const headStyles = (theme) => ({})
const cellStyles = (theme) => ({})
const bodyStyles = (theme) => ({})

const Table = withStyles(tableStyles)(({children, classes, ...props}) => (
  <MaterialPaper className={classes.root}>
    <MaterialTable className={classes.table} {...props}>
      {children}
    </MaterialTable>
  </MaterialPaper>
))

Table.Head = withStyles(headStyles)(({children, classes, ...props}) => (
  <MaterialTableHead {...props}>{children}</MaterialTableHead>
))

Table.HeadRow = withStyles(headRowStyles)(({children, classes, ...props}) => (
  <MaterialTableRow className={classes.headRow} {...props}>
    {children}
  </MaterialTableRow>
))

Table.Row = withStyles(rowStyles)(({children, classes, ...props}) => (
  <MaterialTableRow className={classes.row} {...props}>
    {children}
  </MaterialTableRow>
))

Table.Cell = withStyles(cellStyles)(({children, ...props}) => (
  <MaterialTableCell {...props}>{children}</MaterialTableCell>
))

Table.Body = withStyles(bodyStyles)(({children, ...props}) => (
  <MaterialTableBody {...props}>{children}</MaterialTableBody>
))

export default Table
