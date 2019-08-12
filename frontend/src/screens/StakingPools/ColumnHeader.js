// @flow

import React, {useCallback} from 'react'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {ArrowDropDown, ArrowDropUp, FilterList as FilterIcon} from '@material-ui/icons'

import {Tooltip} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

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
  },
}))

const GeneralFilter = ({field, label}) => {
  const classes = useStyles()
  const tooltipClasses = useTooltipStyles()
  const conf = fieldsConfigMap[field]
  const {Component, isFilterActive} = conf.filter
  const {filters, setFilter, resetFilter} = useFilters()

  const filterConfig = filters[field]
  const onChange = useCallback((v) => setFilter(field, v), [field, setFilter])
  const onReset = useCallback(() => resetFilter(field), [field, resetFilter])

  const filterActive = isFilterActive(filterConfig)

  return (
    <Tooltip
      title={<Component {...{filterConfig, label, onChange, onReset, filterActive}} />}
      classes={tooltipClasses}
      placement="top"
      interactive
      // Needed otherwise tooltip disappears after interaction
      disableFocusListener
    >
      <FilterIcon color={filterActive ? 'inherit' : 'disabled'} className={classes.filterIcon} />
    </Tooltip>
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
                <ArrowDropDown />
              ) : (
                <ArrowDropUp />
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
