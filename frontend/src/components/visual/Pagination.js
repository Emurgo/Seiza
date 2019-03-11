// @flow
import React from 'react'
import classnames from 'classnames'
import {IconButton, Grid, Input, withStyles, withTheme} from '@material-ui/core'
import {
  FirstPage as FirstPageArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageArrow,
} from '@material-ui/icons'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'

import {onDidUpdate} from '@/components/HOC/lifecycles'
import {isInRange} from '@/helpers/validators'
import {withI18n} from '@/i18n/helpers'

const INPUT_PADDING = 10

const I18N_PREFIX = 'pagination'

const ariaLabels = defineMessages({
  lastPage: 'Last Page',
  firstPage: 'First Page',
  nextPage: 'Next Page',
  prevPage: 'Previous Page',
})

const styles = ({palette}) => ({
  input: {
    paddingLeft: `${INPUT_PADDING}px`,
    paddingRight: `${INPUT_PADDING}px`,
  },
  editableInput: {
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: '5px',
  },
  arrow: {
    color: palette.primary.dark,
  },
  arrowWrapper: {
    padding: '4px !important',
  },
  divider: {
    color: palette.grey[500],
    paddingLeft: '10px',
  },
})

const getEstimatedInputWidth = (pageCount: number): number => {
  // Note: those values are quite ad-hoc
  const baseWidth = INPUT_PADDING * 2 + 5
  const charSize = 10
  return String(pageCount).length * charSize + baseWidth
}

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

export default compose(
  withI18n,
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
      return setGoToPage(
        value === '' || isInRange(value, 1, pageCount + 1) ? parseInt(value, 10) : goToPage
      )
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
    reverseDirection,
    i18n: {translate},
  }) => {
    const inputStyle = {width: `${getEstimatedInputWidth(pageCount)}px`}
    const isFirstPage = page === 0
    const isLastPage = page >= pageCount - 1
    return (
      <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onLastPageButtonClick : onFirstPageButtonClick}
            disabled={reverseDirection ? isLastPage : isFirstPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.lastPage) : translate(ariaLabels.firstPage)
            }
          >
            {theme.direction === 'rtl' ? <LastPageArrow /> : <FirstPageArrow />}
          </IconButton>
        </Grid>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onNextButtonClick : onBackButtonClick}
            disabled={reverseDirection ? isLastPage : isFirstPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.nextPage) : translate(ariaLabels.prevPage)
            }
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
        </Grid>
        <Grid item>
          <Grid container direction="row" alignItems="center" justify="center">
            <form onSubmit={onGoToPageSubmit}>
              <Input
                style={inputStyle}
                disableUnderline
                value={goToPage}
                onChange={onGoToPageChange}
                className={classnames(classes.input, classes.editableInput)}
              />
            </form>
            <span className={classes.divider}>/</span>
            <Input
              style={inputStyle}
              disableUnderline
              readOnly
              value={pageCount}
              className={classes.input}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onBackButtonClick : onNextButtonClick}
            disabled={reverseDirection ? isFirstPage : isLastPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.prevPage) : translate(ariaLabels.nextPage)
            }
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
        </Grid>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onFirstPageButtonClick : onLastPageButtonClick}
            disabled={reverseDirection ? isFirstPage : isLastPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.firstPage) : translate(ariaLabels.lastPage)
            }
          >
            {theme.direction === 'rtl' ? <FirstPageArrow /> : <LastPageArrow />}
          </IconButton>
        </Grid>
      </Grid>
    )
  }
)
