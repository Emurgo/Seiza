// @flow
import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
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
import {withHandlers, withProps} from 'recompose'

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
  head: {
    textTransform: 'uppercase',
  },
})

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

const PaginationControlsComponent = compose(
  // TODO: find way how to inject custom props into TablePagination->ActionsComponent
  withProps((props) => ({
    pageCount: getPageCount(props.count, props.rowsPerPage),
  })),
  withHandlers({
    onFirstPageButtonClick: ({onChangePage}) => (event) => onChangePage(0),
    onBackButtonClick: ({onChangePage, page}) => (event) => onChangePage(page - 1),
    onNextButtonClick: ({onChangePage, page}) => (event) => onChangePage(page + 1),
    onLastPageButtonClick: ({onChangePage, pageCount}) => (event) =>
      onChangePage(Math.max(0, pageCount - 1)),
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
        disabled={page >= pageCount - 1}
        aria-label="Next Page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={onLastPageButtonClick}
        disabled={page >= pageCount - 1}
        aria-label="Last Page"
      >
        {theme.direction === 'rtl' ? <FirstPageArrow /> : <LastPageArrow />}
      </IconButton>
    </div>
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
  }) => {
    return (
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
            {bodyData.map((row, index) => (
              <TR key={index} className={classes.row}>
                {row.map((item) => (
                  <TD key={index} align="left">{item}</TD>
                ))}
              </TR>
            ))}
          </TableBody>
          <TableFooter>
            <TR>
              <TablePagination
                colSpan={3}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                rowsPerPageOptions={rowsPerPageOptions}
                SelectProps={{native: true}}
                labelDisplayedRows={paggingInfoFormatter}
                onChangePage={onChangePage}
                ActionsComponent={PaginationControlsComponent}
              />
            </TR>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
)
