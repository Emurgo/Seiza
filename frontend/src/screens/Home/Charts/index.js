// @flow

import idx from 'idx'
import Measure from 'react-measure'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import moment from 'moment-timezone'
import React, {useState, useCallback, useMemo} from 'react'
import {defineMessages} from 'react-intl'
import {FormControl, RadioGroup, FormControlLabel, Radio, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {ObjectValues} from '@/helpers/flow'
import {useAnalytics} from '@/helpers/googleAnalytics'
import {
  SimpleLayout,
  LiteTabs,
  LiteTab,
  Card,
  LoadingInProgress,
  LoadingError,
  Alert,
} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {useCurrentBreakpoint} from '@/components/hooks/useBreakpoints'
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import BarChart from './BarChart'
import {useCurrentEpoch} from '../common'

const messages = defineMessages({
  header: 'Charts',
  totalSentBar: 'Total ADA Sent',
  transactionsCount: 'Transactions Count',
  totalUtxo: 'Total new UTXO',
  noDataTitle: 'No data',
  noDataMsg: 'There are no data to plot',
  adaInBillions: '{count}B', // TODO: some better approach to intl billions character?,
  lastTooltipText: '(in progress)',
})

const xLabels = defineMessages({
  day: 'Day (UTC)',
  epoch: 'Epoch',
})

// Note: now same as `messages` but probably will change
const yLabels = defineMessages({
  txCount: 'Transactions Count',
  adaSent: 'Total Ada Sent',
  utxo: 'Total new UTXO',
})

const X_AXIS = {
  DAY: 'DAY',
  EPOCH: 'EPOCH',
}

const X_AXIS_WINDOW = {
  DAY: 30,
  EPOCH: 20,
}

const useStyles = makeStyles((theme) => ({
  radioWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingRight: 40,
    paddingTop: 10,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  layout: {
    paddingBottom: theme.spacing(2.5),
  },
}))

const TAB_NAMES = {
  TOTAL_ADA_SENT: 'TOTAL_ADA_SENT',
  TRANSACTIONS_COUNT: 'TRANSACTIONS_COUNT',
  TOTAL_UTXO: 'TOTAL_UTXO',
}

const TabsHeader = () => {
  const {translate: tr} = useI18n()
  const analytics = useAnalytics()
  const {currentTabIndex, setTabByEventIndex} = useTabContext()
  const tabs = [
    {id: TAB_NAMES.TOTAL_ADA_SENT, label: tr(messages.totalSentBar)},
    {id: TAB_NAMES.TRANSACTIONS_COUNT, label: tr(messages.transactionsCount)},
    {id: TAB_NAMES.TOTAL_UTXO, label: tr(messages.totalUtxo)},
  ]

  const onChange = useCallback(
    (...args) => {
      analytics.trackChartEvent()
      setTabByEventIndex(...args)
    },
    [analytics, setTabByEventIndex]
  )

  return (
    <LiteTabs defaultBottomOffset value={currentTabIndex} onChange={onChange}>
      {tabs.map(({id, label}) => (
        <LiteTab key={id} label={label} />
      ))}
    </LiteTabs>
  )
}

const identity = (v) => v

const XAxisSwitch = ({value, onChange}) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <FormControl component="fieldset" className={classes.radioWrapper}>
      <RadioGroup
        aria-label="Group by"
        className={classes.radioGroup}
        value={value}
        onChange={onChange}
      >
        <FormControlLabel
          value={X_AXIS.DAY}
          control={<Radio color="primary" />}
          label={tr(xLabels.day)}
        />
        <FormControlLabel
          value={X_AXIS.EPOCH}
          control={<Radio color="primary" />}
          label={tr(xLabels.epoch)}
        />
      </RadioGroup>
    </FormControl>
  )
}

const useLoadData = (seriesType, groupBy, epochInterval, dateInterval) => {
  const {error, loading, data} = useQuery(
    gql`
      query($groupBy: SeriesXAxisGroupBy!, $epochInterval: SeriesEpochInterval, $dateInterval: SeriesDateInterval) {
        aggregateInfo(groupBy: $groupBy, epochInterval: $epochInterval, dateInterval: $dateInterval) {
          ${seriesType} {
            data {
              x
              y
            }
          }
        }
      }
    `,
    {
      variables: {groupBy, epochInterval, dateInterval},
    }
  )

  return {error, loading, data: idx(data, (_) => _.aggregateInfo[seriesType].data) || []}
}

const filterDataBasedOnWidth = (data, breakpoint, groupBy) => {
  const breakpointToItemsCount = {
    DAY: {
      xs: 9,
      sm: 14,
      md: 20,
      lg: 30,
      xl: 30,
    },
    EPOCH: {
      xs: 7,
      sm: 10,
      md: 14,
      lg: 20,
      xl: 20,
    },
  }

  return data.slice(-breakpointToItemsCount[groupBy][breakpoint])
}

const Chart = ({seriesType, xAxisProps, currentEpoch, ...restProps}) => {
  const {translate: tr} = useI18n()
  const breakpoint = useCurrentBreakpoint()

  const groupBy = xAxisProps.value
  const epochInterval = {from: Math.max((currentEpoch || 0) - X_AXIS_WINDOW.EPOCH, 0)}
  const dateInterval = {
    from: moment
      .utc()
      .startOf('day')
      .subtract(X_AXIS_WINDOW.DAY + 300, 'days') // TODO: remove `300` when backend is fixed
      .toISOString(),
  }

  const {error, loading, data} = useLoadData(seriesType, groupBy, epochInterval, dateInterval)

  // Note: `recharts` animation stops working when changing reference to data, therefore
  // using `useMemo` to memoize it
  // TODO: remove when backend is fixed
  const dataFix = useMemo(() => (groupBy === X_AXIS.DAY ? data.slice(-X_AXIS_WINDOW.DAY) : data), [
    data,
    groupBy,
  ])
  const _data = useMemo(() => filterDataBasedOnWidth(dataFix, breakpoint, groupBy), [
    dataFix,
    breakpoint,
    groupBy,
  ])

  if (loading) return <LoadingInProgress />
  if (!loading && error) return <LoadingError error={error} />
  if (!loading && !error && !data.length) {
    return (
      <Alert type="warning" title={tr(messages.noDataTitle)} message={tr(messages.noDataMsg)} />
    )
  }
  return <BarChart data={_data} {...restProps} />
}

const ChartTab = ({loading, error, xAxisProps, commonChartProps, ...restProps}) => {
  return (
    <Card>
      <XAxisSwitch {...xAxisProps} />
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{width: commonChartProps.width, height: commonChartProps.height}}
      >
        {loading && <LoadingInProgress />}
        {!loading && error && <LoadingError error={error} />}
        {!loading && !error && <Chart {...{xAxisProps, ...commonChartProps, ...restProps}} />}
      </Grid>
    </Card>
  )
}

const getChartDimensions = (dimensions) => ({
  width: dimensions.width,
  height: 400,
})

const Charts = () => {
  const classes = useStyles()
  const {
    translate: tr,
    formatAdaInUnits,
    formatAdaSplit,
    formatTimestampToUtcDayAndMonth,
  } = useI18n()
  const analytics = useAnalytics()
  const [xAxis, setXAxis] = useState(X_AXIS.DAY)
  const [dimensions, setDimensions] = useState({width: -1, height: -1})

  const {error, loading, currentEpoch} = useCurrentEpoch()

  const tabNames = ObjectValues(TAB_NAMES)
  const tabState = useTabState(tabNames)

  // Note: We currently receive number from backend instead of string for ada value
  const formatAdaYAxis = (value) =>
    tr(messages.adaInBillions, {count: formatAdaInUnits(`${value}`)})
  // Note: For now not showing decimals, as then values are too long
  const formatAdaYTooltip = (value) => formatAdaSplit(`${value}`).integral
  const onXAxisChange = useCallback(
    (e) => {
      setXAxis(e.target.value)
      analytics.trackChartEvent()
    },
    [analytics]
  )

  const commonChartProps = {
    xLabel: tr(xAxis === X_AXIS.DAY ? xLabels.day : xLabels.epoch),
    formatX: xAxis === X_AXIS.DAY ? formatTimestampToUtcDayAndMonth : identity,
    barSize: xAxis === X_AXIS.DAY ? 14 : 20,
    lastTooltipText: tr(messages.lastTooltipText),
    ...getChartDimensions(dimensions),
  }

  const xAxisProps = {
    value: xAxis,
    onChange: onXAxisChange,
  }

  return (
    <SimpleLayout title={tr(messages.header)} maxWidth="1200px" className={classes.layout}>
      <Measure
        bounds
        onResize={(contentRect) => {
          setDimensions(contentRect.bounds)
        }}
      >
        {({measureRef}) => (
          <div ref={measureRef}>
            <Tabs {...tabState}>
              <TabsHeader />

              <Tab name={TAB_NAMES.TOTAL_ADA_SENT}>
                <ChartTab
                  seriesType="totalAdaTransferred"
                  yLabel={tr(yLabels.adaSent)}
                  formatYTooltip={formatAdaYTooltip}
                  formatYAxis={formatAdaYAxis}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                  {...{loading, error, currentEpoch}}
                />
              </Tab>

              <Tab name={TAB_NAMES.TRANSACTIONS_COUNT}>
                <ChartTab
                  seriesType="txCount"
                  yLabel={tr(yLabels.txCount)}
                  formatYAxis={identity}
                  formatYTooltip={identity}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                  {...{loading, error, currentEpoch}}
                />
              </Tab>

              <Tab name={TAB_NAMES.TOTAL_UTXO}>
                <ChartTab
                  seriesType="totalUtxoCreated"
                  yLabel={tr(yLabels.utxo)}
                  formatYAxis={identity}
                  formatYTooltip={identity}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                  {...{loading, error, currentEpoch}}
                />
              </Tab>
            </Tabs>
          </div>
        )}
      </Measure>
    </SimpleLayout>
  )
}

export default Charts
