// @flow

import React, {useMemo, useCallback} from 'react'
import _ from 'lodash'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {lighten} from '@material-ui/core/styles/colorManipulator'

import {SimpleExpandableCard, Button, Tooltip} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

import {useLocalStorageState} from '@/components/hooks/useStorageState'
import {ItemIdentifier, getHeaderBackground, stackingContext} from '../utils'

import type {ComparisonMatrixProps} from '../types'

const messages = defineMessages({
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
})

const useCategoryStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(1),
    ...stackingContext,
  },
  pool: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  poolBorder: {
    borderBottom: `1px solid ${lighten(theme.palette.contentUnfocus, 0.6)}`,
  },
  header: {
    background: getHeaderBackground(theme),
  },
  headerText: {
    fontWeight: 'bold',
  },
  popper: {
    top: '-10px!important', // Note: does not work without "!important"
  },
}))

const getFieldId = (config) => config.i18nLabel.id

const Category = ({getIdentifier, data, categoryConfig, expandedFields, toggle}) => {
  const intlFormatters = useI18n()
  const {translate: tr} = intlFormatters
  const classes = useCategoryStyles()

  return categoryConfig.map((config, index) => {
    const {i18nLabel, getValue, render, height} = config
    const renderExpandedArea = () => (
      <Grid container>
        {data.map((d, index, arr) => (
          <Grid
            item
            key={index}
            xs={12}
            className={cn(classes.pool, index < arr.length - 1 && classes.poolBorder)}
          >
            <Grid container justify="space-between">
              <Grid item xs={4}>
                <Tooltip
                  title={d.name}
                  placement="bottom"
                  classes={{popper: classes.popper}}
                  interactive
                >
                  {/* Note: Without this extra `div` tooltip is not working */}
                  <div>
                    <ItemIdentifier identifier={getIdentifier(d)} title={d.name} />
                  </div>
                </Tooltip>
              </Grid>
              <Grid item xs={7}>
                <Grid container justify="flex-end">
                  {/* TODO: this logic is same in Desktop version, try to unify */}
                  {render ? (
                    render(d, intlFormatters)
                  ) : getValue ? (
                    <Typography style={height ? {height} : {}} variant="body1" noWrap>
                      {getValue(d, intlFormatters)}
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    )

    const renderHeader = () => (
      <Typography variant="overline" color="textSecondary" className={classes.headerText}>
        {tr(i18nLabel)}
      </Typography>
    )

    const fieldId = getFieldId(config)

    return (
      <div className={classes.wrapper} key={index}>
        <SimpleExpandableCard
          expanded={expandedFields[fieldId]}
          onChange={() => toggle(fieldId)}
          renderHeader={renderHeader}
          renderExpandedArea={renderExpandedArea}
          headerClasses={{root: classes.header}}
        />
      </div>
    )
  })
}

type ComparisonLayoutProps = {
  ...ComparisonMatrixProps,
  expandedFields: {},
  toggle: Function,
}

const ComparisonMatrixLayout = ({
  data,
  categoryConfigs,
  title,
  getIdentifier,
  expandedFields,
  toggle,
}: ComparisonLayoutProps) => (
  <Grid container direction="column">
    {categoryConfigs.map(({config, categoryLabel}, index) => (
      <Grid item key={index} className="w-100">
        <Category categoryConfig={config} {...{data, getIdentifier, expandedFields, toggle}} />
      </Grid>
    ))}
  </Grid>
)

const useGetInitialExpandState = (categoryConfigs) =>
  useMemo(
    () =>
      _(categoryConfigs)
        .map((category) => category.config.map((config) => [getFieldId(config), true]))
        .flatten()
        .fromPairs()
        .value(),
    [categoryConfigs]
  )

const useToggleCardsState = (categoryConfigs, storageKey) => {
  const initialState = useGetInitialExpandState(categoryConfigs)
  const [expandedFields, setExpandedFields] = useLocalStorageState<{}>(storageKey, initialState)

  const toggle = useCallback(
    (field) => setExpandedFields((state) => ({...state, [field]: !state[field]})),
    [setExpandedFields]
  )

  const expandAll = useCallback(
    () => setExpandedFields((state) => _.mapValues(state, (v) => true)),
    [setExpandedFields]
  )

  const collapseAll = useCallback(
    () => setExpandedFields((state) => _.mapValues(state, (v) => false)),
    [setExpandedFields]
  )

  const expandedAll = useMemo(() => _.every(expandedFields, (value) => value === true), [
    expandedFields,
  ])

  return {toggle, expandAll, collapseAll, expandedAll, expandedFields}
}

const ToggleExpandAllButton = ({expandAll, collapseAll, expandedAll}) => {
  const {translate: tr} = useI18n()
  const label = tr(expandedAll ? messages.collapseAll : messages.expandAll)

  return <Button onClick={expandedAll ? collapseAll : expandAll}>{label}</Button>
}

const useWrapperStyles = makeStyles((theme) => ({
  toggleWrapper: {
    padding: theme.spacing(1),
  },
}))

const MobileComparisonMatrix = (props: ComparisonMatrixProps) => {
  const {expandAll, collapseAll, expandedAll, toggle, expandedFields} = useToggleCardsState(
    props.categoryConfigs,
    props.expandedColumnsStorageKey
  )
  const classes = useWrapperStyles()

  return (
    <React.Fragment>
      <Grid container justify="flex-end" className={classes.toggleWrapper}>
        <ToggleExpandAllButton {...{expandAll, collapseAll, expandedAll}} />
      </Grid>
      <ComparisonMatrixLayout {...props} {...{expandedFields, toggle}} />
    </React.Fragment>
  )
}

export default MobileComparisonMatrix
