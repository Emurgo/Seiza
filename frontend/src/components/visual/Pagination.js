// @flow
import React, {useCallback} from 'react'
import classnames from 'classnames'
import {IconButton, Grid, Input} from '@material-ui/core'
import {useTheme, makeStyles} from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {defineMessages} from 'react-intl'

import {ReactComponent as FirstPageArrow} from '@/assets/icons/arrow-first-page.svg'
import {ReactComponent as LastPageArrow} from '@/assets/icons/arrow-last-page.svg'
import {ReactComponent as ArrowLeft} from '@/assets/icons/arrow-left.svg'
import {ReactComponent as ArrowRight} from '@/assets/icons/arrow-right.svg'
import {isInRange, isInteger} from '@/helpers/validators'
import {useI18n} from '@/i18n/helpers'
import {useStateWithChangingDefault} from '@/components/hooks/useStateWithChangingDefault'

// Note!!!: pages are numbered from 1 so that urls are consistent with the rest of UI

const INPUT_PADDING_MOBILE = 2
const INPUT_PADDING_DESKTOP = 8

const ariaLabels = defineMessages({
  lastPage: 'Last Page',
  firstPage: 'First Page',
  nextPage: 'Next Page',
  prevPage: 'Previous Page',
})

const useStyles = makeStyles(({palette, typography, breakpoints, spacing}) => ({
  editableInput: {
    border: `1px solid ${palette.contentFocus}`,
    borderRadius: '5px',
    padding: 0.5 * typography.fontSize,
  },
  input: {
    padding: spacing(0.25),
    fontSize: '14px',
    [breakpoints.up('md')]: {
      padding: spacing(1),
      fontSize: '18px',
    },
  },
  arrowWrapper: {
    padding: '3px !important',
    [breakpoints.up('md')]: {
      padding: '4px !important',
    },
  },
  arrow: {
    padding: spacing(0.5),
    [breakpoints.up('md')]: {
      padding: spacing(1.5),
    },
  },
  divider: {
    color: palette.contentFocus,
    paddingLeft: spacing(0.4),
    [breakpoints.up('sm')]: {
      paddingLeft: spacing(1),
    },
    [breakpoints.up('md')]: {
      paddingLeft: spacing(2.5),
    },
  },
}))

const getEstimatedInputWidth = (pageCount: number, isDesktop): number => {
  // Note: those values are quite ad-hoc
  const padding = isDesktop ? INPUT_PADDING_DESKTOP : INPUT_PADDING_MOBILE
  const baseWidth = padding * 2 + 10
  const charSize = isDesktop ? 11 : 8
  return String(pageCount).length * charSize + baseWidth
}

const inputProps = {style: {textAlign: 'center', padding: '6px 0 6px'}}

const ArrowWrapper = ({children, onClick, disabled, ariaLabel}) => {
  const classes = useStyles()
  return (
    <Grid item className={classes.arrowWrapper}>
      <IconButton
        className={classes.arrow}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        color="primary"
      >
        {children}
      </IconButton>
    </Grid>
  )
}

const usePaginationHandlers = (page, onChangePage, pageCount, inputValue, setInputValue) => {
  const onFirstPageButtonClick = useCallback((event) => onChangePage(1), [onChangePage])
  const onBackButtonClick = useCallback((event) => onChangePage(page - 1), [onChangePage, page])
  const onNextButtonClick = useCallback((event) => onChangePage(page + 1), [onChangePage, page])
  const onLastPageButtonClick = useCallback((event) => onChangePage(Math.max(1, pageCount)), [
    onChangePage,
    pageCount,
  ])

  const onInputValueChange = useCallback(
    (event) => {
      const {value} = event.target
      if (value === '') {
        setInputValue(value)
      } else {
        const parsed = parseInt(value, 10)
        if (!isNaN(parsed) && isInRange(parsed, 1, pageCount + 1)) setInputValue(parsed)
      }
    },
    [pageCount, setInputValue]
  )

  const onInputValueSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (inputValue === '') return
      onChangePage(inputValue)
    },
    [inputValue, onChangePage]
  )

  return {
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
    onInputValueChange,
    onInputValueSubmit,
  }
}

type InnerProps = {|
  pageCount: number,
  page: number,
  onChangePage: Function,
  reverseDirection?: boolean,
|}

const Pagination = ({page, reverseDirection, pageCount, onChangePage}: InnerProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  const [inputValue, setInputValue] = useStateWithChangingDefault(page)

  const {
    onFirstPageButtonClick,
    onBackButtonClick,
    onNextButtonClick,
    onLastPageButtonClick,
    onInputValueChange,
    onInputValueSubmit,
  } = usePaginationHandlers(page, onChangePage, pageCount, inputValue, setInputValue)

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const inputStyle = {width: `${getEstimatedInputWidth(pageCount, isDesktop)}px`}
  const isFirstPage = page <= 1
  const isLastPage = page >= pageCount

  const LeftSideArrows = (
    <React.Fragment>
      <ArrowWrapper
        onClick={reverseDirection ? onLastPageButtonClick : onFirstPageButtonClick}
        disabled={reverseDirection ? isLastPage : isFirstPage}
        ariaLabel={reverseDirection ? tr(ariaLabels.lastPage) : tr(ariaLabels.firstPage)}
      >
        <FirstPageArrow />
      </ArrowWrapper>
      <ArrowWrapper
        onClick={reverseDirection ? onNextButtonClick : onBackButtonClick}
        disabled={reverseDirection ? isLastPage : isFirstPage}
        ariaLabel={reverseDirection ? tr(ariaLabels.nextPage) : tr(ariaLabels.prevPage)}
      >
        <ArrowLeft />
      </ArrowWrapper>
    </React.Fragment>
  )

  const RightSideArrows = (
    <React.Fragment>
      <ArrowWrapper
        onClick={reverseDirection ? onBackButtonClick : onNextButtonClick}
        disabled={reverseDirection ? isFirstPage : isLastPage}
        ariaLabel={reverseDirection ? tr(ariaLabels.prevPage) : tr(ariaLabels.nextPage)}
      >
        <ArrowRight />
      </ArrowWrapper>
      <ArrowWrapper
        onClick={reverseDirection ? onFirstPageButtonClick : onLastPageButtonClick}
        disabled={reverseDirection ? isFirstPage : isLastPage}
        ariaLabel={reverseDirection ? tr(ariaLabels.firstPage) : tr(ariaLabels.lastPage)}
      >
        <LastPageArrow />
      </ArrowWrapper>
    </React.Fragment>
  )

  const Controls = (
    <Grid item>
      <Grid container direction="row" alignItems="center" justify="center">
        <form onSubmit={onInputValueSubmit}>
          <Input
            style={inputStyle}
            disableUnderline
            value={inputValue}
            onChange={onInputValueChange}
            className={classnames(classes.input, classes.editableInput)}
            inputProps={inputProps}
          />
        </form>
        <span className={classes.divider}>/</span>
        <Input
          style={inputStyle}
          disableUnderline
          readOnly
          className={classes.input}
          value={pageCount}
          inputProps={inputProps}
        />
      </Grid>
    </Grid>
  )

  // Note: used this way as if we wanted to divide pagination on mobile to multiple
  // rows, it would be easy.
  return (
    <Grid container wrap="nowrap" direction="row" justify="center" alignItems="center">
      {LeftSideArrows}
      {Controls}
      {RightSideArrows}
    </Grid>
  )
}

type OuterProps = {|
  pageCount: ?number,
  page: ?number,
  onChangePage: Function,
  reverseDirection?: boolean,
|}

const isPageValid = (page: ?number, pageCount: ?number) => {
  if (!isInteger(page)) return false

  // Cant really determine in that case
  if (pageCount == null) return true

  if (!isInRange(page, 1, pageCount + 1)) return false

  return true
}

const getValidatedPage = (page: ?number, pageCount: ?number) => {
  // Note: parseInt is used because of flow
  return isPageValid(page, pageCount) ? parseInt(page, 10) : 0
}

// Note: all responsibility of this wrapper could be moved to components calling <Pagination />
// but for simplicity is now encapsulated in single place
export default ({page, pageCount, ...rest}: OuterProps) => {
  // Note: Instead of showing 0/0 loading, it looks better when pagination is hidden
  if (!pageCount) return null

  return <Pagination page={getValidatedPage(page, pageCount)} pageCount={pageCount} {...rest} />
}
