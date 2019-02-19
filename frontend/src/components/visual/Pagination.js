// @flow
import React from 'react'
import {IconButton, Typography, Grid, withTheme} from '@material-ui/core'
import {
  FirstPage as FirstPageArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageArrow,
} from '@material-ui/icons'
import {compose} from 'redux'
import {withHandlers, withProps} from 'recompose'

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

export default compose(
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
  withTheme(),
)(
  ({
    theme,
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
    pageCount,
    page,
  }) => (
    <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
      <Grid item>
        <Typography variant="caption">{page + 1}/{pageCount}</Typography>
      </Grid>
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
    </Grid>
  )
)
