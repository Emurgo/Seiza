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
  Typography,
  TableFooter,
  Input,
  Grid,
  withStyles,
} from '@material-ui/core'
import {
  FirstPage as FirstPageArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageArrow,
} from '@material-ui/icons'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {Link} from 'react-router-dom'
import {withHandlers, withProps, withStateHandlers} from 'recompose'

import {withI18n} from '../../../i18n/helpers'
import {isInRange} from '../../../helpers/validators'

const TABLE_I18N_PREFIX = 'blockchain.blockList.table'
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
  goToPage: {
    marginLeft: '30px',
  },
  goToPageInput: {
    width: '100px',
  },
  goToPageLabel: {
    paddingRight: '10px',
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

const linkFieldStyles = (theme) => ({
  linkField: {
    color: theme.palette.primary.dark,
  },
})

const headerCellStyles = () => ({
  text: {
    textTransform: 'uppercase',
  },
})

const LinkField = withStyles(linkFieldStyles)(({children, to, classes}) => (
  <Link to={to} className={classes.linkField}>
    {children}
  </Link>
))

const HeaderCell = withStyles(headerCellStyles)(({children, classes}) => (
  <TableCell align="left">
    <span className={classes.text}>{children}</span>
  </TableCell>
))

const BodyCell = ({children}) => <TableCell align="left">{children}</TableCell>

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

const PaginationControlsComponent = compose(
  // TODO: find way how to inject custom props into TablePagination->ActionsComponent
  withProps((props) => ({
    pageCount: getPageCount(props.count, props.rowsPerPage),
  })),
  withStateHandlers(
    {goToPage: ''},
    {
      setGoToPage: () => (goToPage) => ({goToPage}),
    }
  ),
  withHandlers({
    onFirstPageButtonClick: ({onChangePage}) => (event) => onChangePage(0),
    onBackButtonClick: ({onChangePage, page}) => (event) => onChangePage(page - 1),
    onNextButtonClick: ({onChangePage, page}) => (event) => onChangePage(page + 1),
    onLastPageButtonClick: ({onChangePage, pageCount}) => (event) =>
      onChangePage(Math.max(0, pageCount - 1)),
    onGoToPageChange: ({setGoToPage, pageCount, goToPage, jozo}) => (event) => {
      const value = event.target.value
      return setGoToPage(value === '' || isInRange(value, 1, pageCount + 1) ? value : goToPage)
    },
    onGoToPageSubmit: ({onChangePage, goToPage}) => (e) => {
      e.preventDefault()
      if (goToPage === '') return
      onChangePage(goToPage - 1)
    },
  }),
  withStyles(actionsStyles, {withTheme: true})
)(
  ({
    classes,
    theme,
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
    pageCount,
    page,
    goToPage,
    onGoToPageChange,
    onGoToPageSubmit,
  }) => (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <IconButton onClick={onFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
          {theme.direction === 'rtl' ? <LastPageArrow /> : <FirstPageArrow />}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={onBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={onNextButtonClick}
          disabled={page >= pageCount - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={onLastPageButtonClick}
          disabled={page >= pageCount - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageArrow /> : <LastPageArrow />}
        </IconButton>
      </Grid>
      <Grid item>
        <Grid
          container
          className={classes.goToPage}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* TODO: intl and better design: consider directly changing current page */}
          <Typography className={classes.goToPageLabel}>Go to page:</Typography>
          <form onSubmit={onGoToPageSubmit}>
            <Input className={classes.goToPageInput} value={goToPage} onChange={onGoToPageChange} />
          </form>
        </Grid>
      </Grid>
    </Grid>
  )
)

export default compose(
  withStyles(tableStyles),
  withProps((props) => ({
    pageCount: getPageCount(props.totalCount, props.rowsPerPage),
  })),
  withHandlers({
    // Note: this is because MaterailUI calls this formatter with predefined set of props
    // which do not contain 'pageCount'
    paggingInfoFormatter: ({pageCount}) => ({page}) => `${page + 1}/${pageCount}`,
  }),
  withI18n
)(
  ({
    blocks,
    i18n,
    classes,
    page,
    onChangePage,
    totalCount,
    rowsPerPage,
    paggingInfoFormatter,
    rowsPerPageOptions,
  }) => {
    const {translate, formatInt, formatAda, formatTimestamp} = i18n
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
                <BodyCell>{formatTimestamp(block.timeIssued)}</BodyCell>
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
                colSpan={5}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                rowsPerPageOptions={rowsPerPageOptions}
                SelectProps={{native: true}}
                labelDisplayedRows={paggingInfoFormatter}
                onChangePage={onChangePage}
                ActionsComponent={PaginationControlsComponent}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
)
