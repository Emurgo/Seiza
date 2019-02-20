// @flow
import React from 'react'
import {IconButton, Grid, Input, withStyles, withTheme} from '@material-ui/core'
import {
  FirstPage as FirstPageArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageArrow,
} from '@material-ui/icons'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'

import {onDidUpdate} from '../../components/HOC/lifecycles'
import {isInRange} from '../../helpers/validators'

const styles = (theme) => ({
  input: {
    width: '80px',
  },
})

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

export default compose(
  withProps((props) => ({
    pageCount: getPageCount(props.count, props.rowsPerPage),
  })),
  withStateHandlers((props) => ({goToPage: props.page + 1}), {
    setGoToPage: () => (goToPage) => ({goToPage}),
  }),
  onDidUpdate(
    (props, prevProps) => prevProps.page !== props.page && props.setGoToPage(props.page + 1)
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
  withStyles(styles),
  withTheme()
)(
  ({
    theme,
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
    pageCount,
    page,
    classes,
    goToPage,
    onGoToPageChange,
    onGoToPageSubmit,
  }) => (
    <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
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
        <Grid container direction="row">
          <form onSubmit={onGoToPageSubmit}>
            <Input value={goToPage} onChange={onGoToPageChange} className={classes.input} />
          </form>
          <Input disabled value={`/ ${pageCount}`} className={classes.input} />
        </Grid>
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
