// @flow

import _ from 'lodash'
import React, {useCallback, useMemo, useEffect} from 'react'
import {Typography, Grid, ClickAwayListener} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {ArrowDropDown, ArrowDropUp, FilterList as FilterIcon} from '@material-ui/icons'

import {Tooltip} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import useBooleanState from '@/components/hooks/useBooleanState'

import {useScrollableWrapperRef} from './scrollableWrapperUtils'
import {fieldsConfigMap} from './fieldsConfig'
import {useFilters} from './filtersUtils'
import {ORDER, useSortOptions} from './sortUtils'

const useStyles = makeStyles((theme) => ({
  sortWrapper: {
    cursor: 'pointer',
  },
  filterIcon: {
    marginRight: theme.spacing(0.8),
    paddingLeft: theme.spacing(0.8), // Note: controls icon size
  },
}))

const useTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    maxWidth: '100%',
    margin: 0, // Note: because it blocks "onClickAway"
    top: -25,
    position: 'relative',
  },
}))

let tooltipClickedAt = Date.now()

const useCloseTooltipOnScroll = (closeTooltip) => {
  const {scrollableWrapperNode} = useScrollableWrapperRef()
  const onScroll = useMemo(() => _.throttle(closeTooltip, 500), [closeTooltip])

  useEffect(() => {
    if (scrollableWrapperNode) {
      scrollableWrapperNode.addEventListener('scroll', onScroll)
      return () => {
        scrollableWrapperNode.removeEventListener('scroll', onScroll)
      }
    }
    return () => null
  }, [onScroll, scrollableWrapperNode])
}

const GeneralFilter = ({field, label}) => {
  const classes = useStyles()
  const tooltipClasses = useTooltipStyles()

  const conf = fieldsConfigMap[field]
  const {Component, isFilterActive} = conf.filter
  const {filters, setFilter, resetFilter} = useFilters()

  const [tooltipOpen, openTooltip, closeTooltip] = useBooleanState(false)
  const toggleTooltip = useCallback(() => (tooltipOpen ? closeTooltip() : openTooltip()), [
    closeTooltip,
    openTooltip,
    tooltipOpen,
  ])

  const filterConfig = filters[field]
  const onChange = useCallback((v) => setFilter(field, v), [field, setFilter])
  const onReset = useCallback(() => resetFilter(field), [field, resetFilter])

  useCloseTooltipOnScroll(closeTooltip)

  // Note (hack): as Tooltip is rendered in Portal, `onClickAway` is also fired when
  // user clicks into Tooltip and we do not want to close Tooltip then (so we use this
  // hack with date as Tooltip onClick is always executed first on desktop and on mobile
  // we need to call `openTooltip` as `onClickAway` seems to be executed twice).
  // We can not use `e.stopPropagation` as we handle two separate events.
  // We could render Tooltip without Portal, but then `placement=top` does not work
  // because of "overflow: hidden" nature of StakePoolList table.
  const onClickAway = useCallback(() => {
    if (Date.now() - tooltipClickedAt > 300) {
      closeTooltip()
    }
  }, [closeTooltip])
  const popperProps = useMemo(
    () => ({
      onClick: () => {
        tooltipClickedAt = Date.now()
        openTooltip() // Note: this line is required for mobile only ...
      },
    }),
    [openTooltip]
  )

  const filterActive = isFilterActive(filterConfig)

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className="d-flex">
        <Tooltip
          PopperProps={popperProps}
          title={<Component {...{filterConfig, label, onChange, onReset, filterActive}} />}
          classes={tooltipClasses}
          placement="top"
          interactive
          // Needed otherwise tooltip disappears after interaction
          disableFocusListener
          disableHoverListener
          disableTouchListener
          onClose={closeTooltip}
          open={tooltipOpen}
        >
          <FilterIcon
            color={filterActive ? 'primary' : 'disabled'}
            className={classes.filterIcon}
            onClick={toggleTooltip}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}

type Props = {
  field: string,
}

const ColumnHeader = ({field}: Props) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {sortOptions, setSortBy} = useSortOptions()

  const onSortByChange = useCallback(() => setSortBy(field), [field, setSortBy])
  const sortActive = field === sortOptions.field

  const conf = fieldsConfigMap[field]
  const hasFilter = conf.filter
  const label = conf.getLabel({tr})

  return (
    <Grid container alignItems="center" wrap="nowrap">
      {hasFilter && <GeneralFilter {...{field, label}} />}

      <Grid item onClick={onSortByChange} className={classes.sortWrapper}>
        <Grid container alignItems="center" wrap="nowrap">
          <Typography variant="overline" color={sortActive ? 'textPrimary' : 'textSecondary'}>
            {label}
          </Typography>

          <Grid container alignItems="center">
            {sortActive ? (
              sortOptions.order === ORDER.DESC ? (
                <ArrowDropDown color="primary" />
              ) : (
                <ArrowDropUp color="primary" />
              )
            ) : (
              <ArrowDropDown color="disabled" />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ColumnHeader
