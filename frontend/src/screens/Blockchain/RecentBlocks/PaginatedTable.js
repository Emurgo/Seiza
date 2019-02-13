// @flow
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TableFooter,
  withStyles,
} from '@material-ui/core'
import {
  FirstPage as FirstPageArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageArrow,
} from '@material-ui/icons'
import {compose} from 'redux'
import {injectIntl, defineMessages} from 'react-intl'
import {Link} from 'react-router-dom'
import {withHandlers} from 'recompose'

import {getIntlFormatters} from '../../../i18n/helpers'
import {I18N_PREFIX} from './'

const TABLE_I18N_PREFIX = `${I18N_PREFIX}.table`

// TODO?: aria-label messages
const tableMessages = defineMessages({
  epoch: {
    id: `${TABLE_I18N_PREFIX}.epoch`,
    defaultMessage: 'epoch',
  },
  slot: {
    id: `${TABLE_I18N_PREFIX}.slot`,
    defaultMessage: 'slot',
  },
  slotLeader: {
    id: `${TABLE_I18N_PREFIX}.slotLeader`,
    defaultMessage: 'slot leader',
  },
  time: {
    id: `${TABLE_I18N_PREFIX}.time`,
    defaultMessage: 'time',
  },
  transactions: {
    id: `${TABLE_I18N_PREFIX}.transactions`,
    defaultMessage: 'transactions',
  },
  totalSent: {
    id: `${TABLE_I18N_PREFIX}.totalSent`,
    defaultMessage: 'total sent (ADA)',
  },
  fees: {
    id: `${TABLE_I18N_PREFIX}.fees`,
    defaultMessage: 'fees (ADA)',
  },
  size: {
    id: `${TABLE_I18N_PREFIX}.size`,
    defaultMessage: 'size (B)',
  },
})

const actionsStyles = (theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
})

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
})

// TODO: extract to separate file after having two separate tables
const linkFieldStyles = (theme) => ({
  linkField: {
    color: theme.palette.primary.dark,
  },
})

// TODO: extract to separate file after having two separate tables
const headerCellStyles = () => ({
  text: {
    textTransform: 'uppercase',
  },
})

// TODO: extract to separate file after having two separate tables
const LinkField = withStyles(linkFieldStyles)(({children, to, classes}) => (
  <Link to={to} className={classes.linkField}>
    {children}
  </Link>
))

// TODO: extract to separate file after having two separate tables
const HeaderCell = withStyles(headerCellStyles)(({children, classes}) => (
  <TableCell align="left">
    <span className={classes.text}>{children}</span>
  </TableCell>
))

const BodyCell = ({children}) => <TableCell align="left">{children}</TableCell>

const TablePaginationActions = compose(
  withHandlers({
    onFirstPageButtonClick: ({onChangePage}) => (event) => onChangePage(0),
    onBackButtonClick: ({onChangePage, page}) => (event) => onChangePage(page - 1),
    onNextButtonClick: ({onChangePage, page}) => (event) => onChangePage(page + 1),
    onLastPageButtonClick: ({onChangePage, count, rowsPerPage}) => (event) =>
      onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1)),
  })
)(
  ({
    classes,
    count,
    page,
    rowsPerPage,
    theme,
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
  }) => (
    <div className={classes.root}>
      <IconButton onClick={onFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
        {theme.direction === 'rtl' ? <LastPageArrow /> : <FirstPageArrow />}
      </IconButton>
      <IconButton onClick={onBackButtonClick} disabled={page === 0} aria-label="Previous Page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={onNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={onLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        {theme.direction === 'rtl' ? <FirstPageArrow /> : <LastPageArrow />}
      </IconButton>
    </div>
  )
)

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
  TablePaginationActions
)

export default compose(
  withStyles(tableStyles),
  withHandlers({
    labelDisplayedRows: ({rowsPerPage}) => ({page, count}) =>
      `${page + 1}/${Math.ceil(count / rowsPerPage)}`,
  }),
  injectIntl
)(
  ({
    blocks,
    intl,
    classes,
    page,
    onChangePage,
    totalCount,
    rowsPerPage,
    labelDisplayedRows,
    rowsPerPageOptions,
  }) => {
    const {translate, formatInt, formatAda} = getIntlFormatters(intl)
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>{translate(tableMessages.epoch)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.slot)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.slotLeader)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.time)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.transactions)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.totalSent)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.fees)}</HeaderCell>
              <HeaderCell>{translate(tableMessages.size)}</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((block) => (
              <TableRow key={block.blockHash} className={classes.row}>
                <BodyCell>
                  <LinkField to="/todo">{formatInt(block.epoch)}</LinkField>
                </BodyCell>
                <BodyCell>
                  <LinkField to="/todo">{formatInt(block.slot)}</LinkField>
                </BodyCell>
                <BodyCell>
                  <LinkField to="/todo">{block.blockLead}</LinkField>
                </BodyCell>
                <BodyCell>{block.timeIssued}</BodyCell>
                <BodyCell>{formatInt(block.transactionsCount)}</BodyCell>
                <BodyCell>{formatAda(block.totalSend)}</BodyCell>
                <BodyCell>{formatAda(block.totalFees)}</BodyCell>
                <BodyCell>{formatInt(block.size)}</BodyCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                rowsPerPageOptions={rowsPerPageOptions}
                SelectProps={{native: true}}
                labelDisplayedRows={labelDisplayedRows}
                onChangePage={onChangePage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
)
