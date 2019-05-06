// @flow
import React from 'react'
import classnames from 'classnames'
import {IconButton, Grid, Input, Hidden, withStyles, withTheme} from '@material-ui/core'
import {compose} from 'redux'
import {withHandlers, withStateHandlers, withProps} from 'recompose'
import {defineMessages} from 'react-intl'

import {ReactComponent as FirstPageArrow} from '@/assets/icons/arrow-first-page.svg'
import {ReactComponent as LastPageArrow} from '@/assets/icons/arrow-last-page.svg'
import {ReactComponent as ArrowLeft} from '@/assets/icons/arrow-left.svg'
import {ReactComponent as ArrowRight} from '@/assets/icons/arrow-right.svg'
import {onDidUpdate, onDidMount} from '@/components/HOC/lifecycles'
import {isInRange} from '@/helpers/validators'
import {withI18n} from '@/i18n/helpers'

// Note!!!: pages are numbered from 1 so that urls is consistent with the rest of UI

const INPUT_PADDING = 10

const ariaLabels = defineMessages({
  lastPage: 'Last Page',
  firstPage: 'First Page',
  nextPage: 'Next Page',
  prevPage: 'Previous Page',
})

const styles = ({palette, typography}) => ({
  input: {
    paddingLeft: `${INPUT_PADDING * 2}px`,
  },
  editableInput: {
    border: `1px solid ${palette.contentFocus}`,
    borderRadius: '5px',
    padding: 0.5 * typography.fontSize,
  },
  arrowWrapper: {
    padding: '4px !important',
  },
  divider: {
    color: palette.contentFocus,
    paddingLeft: '20px',
  },
})

const getEstimatedInputWidth = (pageCount: number): number => {
  // Note: those values are quite ad-hoc
  const baseWidth = INPUT_PADDING * 2 + 5
  const charSize = 11
  return String(pageCount).length * charSize + baseWidth
}

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

const inputProps = {style: {textAlign: 'center', padding: '6px 0 6px'}}

// TODO: refactor this whole `composition` of hell
export default compose(
  withI18n,
  withProps((props) => ({
    page: props.page == null ? 1 : props.page,
    pageCount: getPageCount(props.count, props.rowsPerPage),
  })),
  withStateHandlers((props) => ({goToPageValue: props.pageCount > 0 ? props.page : 0}), {
    setGoToPageValue: () => (goToPageValue) => ({goToPageValue}),
  }),
  withHandlers({
    setValidatedPage: ({onChangePage, reverseDirection, setGoToPageValue, pageCount}) => (page) => {
      // TODO: handle invalid page input some better way
      if (!pageCount) return
      let _page = page
      if (page < 1 || page > pageCount) {
        _page = reverseDirection ? pageCount : 1
        onChangePage(_page)
      }
      setGoToPageValue(_page)
    },
  }),
  onDidMount((props) => {
    props.setValidatedPage(props.page)
  }),
  onDidUpdate((props, prevProps) => {
    if (
      (props.pageCount > 0 && prevProps.pageCount !== props.pageCount) ||
      prevProps.page !== props.page
    ) {
      props.setValidatedPage(props.page)
    }
  }),
  withHandlers({
    onFirstPageButtonClick: ({onChangePage}) => (event) => onChangePage(1),
    onBackButtonClick: ({onChangePage, page}) => (event) => onChangePage(page - 1),
    onNextButtonClick: ({onChangePage, page}) => (event) => onChangePage(page + 1),
    onLastPageButtonClick: ({onChangePage, pageCount}) => (event) =>
      onChangePage(Math.max(1, pageCount)),
    onGoToPageChange: ({setGoToPageValue, pageCount, goToPageValue}) => (event) => {
      const value = event.target.value
      if (value === '') return setGoToPageValue(value)
      return setGoToPageValue(
        isInRange(value, 1, pageCount + 1) ? parseInt(value, 10) : goToPageValue
      )
    },
    onGoToPageSubmit: ({onChangePage, goToPageValue}) => (e) => {
      e.preventDefault()
      if (goToPageValue === '') return
      onChangePage(goToPageValue)
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
    goToPageValue,
    onGoToPageChange,
    onGoToPageSubmit,
    reverseDirection,
    i18n: {translate},
  }) => {
    const inputStyle = {width: `${getEstimatedInputWidth(pageCount)}px`}
    const isFirstPage = page <= 1
    const isLastPage = page >= pageCount

    const LeftSideArrows = (
      <React.Fragment>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onLastPageButtonClick : onFirstPageButtonClick}
            disabled={reverseDirection ? isLastPage : isFirstPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.lastPage) : translate(ariaLabels.firstPage)
            }
            color="primary"
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
            color="primary"
          >
            {theme.direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
          </IconButton>
        </Grid>
      </React.Fragment>
    )

    const RightSideArrows = (
      <React.Fragment>
        <Grid item className={classes.arrowWrapper}>
          <IconButton
            className={classes.arrow}
            onClick={reverseDirection ? onBackButtonClick : onNextButtonClick}
            disabled={reverseDirection ? isFirstPage : isLastPage}
            aria-label={
              reverseDirection ? translate(ariaLabels.prevPage) : translate(ariaLabels.nextPage)
            }
            color="primary"
          >
            {theme.direction === 'rtl' ? <ArrowLeft /> : <ArrowRight />}
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
            color="primary"
          >
            {theme.direction === 'rtl' ? <FirstPageArrow /> : <LastPageArrow />}
          </IconButton>
        </Grid>
      </React.Fragment>
    )

    const Controls = (
      <Grid item>
        <Grid container direction="row" alignItems="center" justify="center">
          <form onSubmit={onGoToPageSubmit}>
            <Input
              style={inputStyle}
              disableUnderline
              value={goToPageValue}
              onChange={onGoToPageChange}
              className={classnames(classes.editableInput)}
              inputProps={inputProps}
            />
          </form>
          <span className={classes.divider}>/</span>
          <Input
            style={inputStyle}
            disableUnderline
            readOnly
            value={pageCount}
            className={classes.input}
            inputProps={inputProps}
          />
        </Grid>
      </Grid>
    )

    return (
      <React.Fragment>
        <Hidden xsDown>
          <Grid container wrap="nowrap" direction="row" justify="center" alignItems="center">
            {LeftSideArrows}
            {Controls}
            {RightSideArrows}
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container wrap="nowrap" direction="row" justify="center" alignItems="center">
            {Controls}
          </Grid>
          <Grid container wrap="nowrap" direction="row" justify="center" alignItems="center">
            {LeftSideArrows}
            {RightSideArrows}
          </Grid>
        </Hidden>
      </React.Fragment>
    )
  }
)
