// @flow

import idx from 'idx'
import Measure from 'react-measure'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import moment from 'moment'
import React, {useState, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {FormControl, RadioGroup, FormControlLabel, Radio, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {ObjectValues} from '@/helpers/flow'
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
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import BarChart from './BarChart'
import {useCurrentEpoch} from '../common'

const messages = defineMessages({
  header: 'Charts',
  totalSentBar: 'Total ADA Sent',
  transactionsCount: 'Transactions Count',
  totalUtxo: 'Total UTXO',
  noDataTitle: 'No data',
  noDataMsg: 'There are no data to plot',
})

const xLabels = defineMessages({
  day: 'Day',
  epoch: 'Epoch',
})

// Note: now same as `messages` but probably will change
const yLabels = defineMessages({
  txCount: 'Transactions Count',
  adaSent: 'Total Ada Sent',
  utxo: 'Total UTXO',
})

const X_AXIS = {
  DAY: 'DAY',
  EPOCH: 'EPOCH',
}

const X_AXIS_WINDOW = {
  DAY: 30, // TODO: what to do when there are missing data?
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
}))

const TAB_NAMES = {
  TOTAL_ADA_SENT: 'TOTAL_ADA_SENT',
  TRANSACTIONS_COUNT: 'TRANSACTIONS_COUNT',
  TOTAL_UTXO: 'TOTAL_UTXO',
}

const TabsHeader = () => {
  const {translate: tr} = useI18n()
  const {currentTabIndex, setTabByEventIndex} = useTabContext()
  const tabs = [
    {id: TAB_NAMES.TOTAL_ADA_SENT, label: tr(messages.totalSentBar)},
    {id: TAB_NAMES.TRANSACTIONS_COUNT, label: tr(messages.transactionsCount)},
    {id: TAB_NAMES.TOTAL_UTXO, label: tr(messages.totalUtxo)},
  ]

  return (
    <LiteTabs alignLeft value={currentTabIndex} onChange={setTabByEventIndex}>
      {tabs.map(({id, label}) => (
        <LiteTab key={id} label={label} />
      ))}
    </LiteTabs>
  )
}

// TODO: get proper format, probably use global constant
const formatDay = (timestamp) => moment(timestamp).format('DD.MM')

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

const Chart = ({seriesType, commonChartProps, xAxisProps, formatY, yLabel, currentEpoch}) => {
  const {translate: tr} = useI18n()
  const groupBy = xAxisProps.value
  const epochInterval = {from: Math.max((currentEpoch || 0) - X_AXIS_WINDOW.EPOCH, 0)}
  const dateInterval = {
    from: moment
      .utc()
      .startOf('day')
      .subtract(X_AXIS_WINDOW.DAY, 'days')
      .toISOString(),
  }

  const {error, loading, data} = useLoadData(seriesType, groupBy, epochInterval, dateInterval)

  if (loading) return <LoadingInProgress />
  if (!loading && error) return <LoadingError error={error} />
  if (!loading && !error && !data.length) {
    return (
      <Alert type="warning" title={tr(messages.noDataTitle)} message={tr(messages.noDataMsg)} />
    )
  }
  return <BarChart {...{data, yLabel, formatY}} {...commonChartProps} />
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
        {!loading && !error && (
          <Chart {...restProps} xAxisProps={xAxisProps} commonChartProps={commonChartProps} />
        )}
      </Grid>
    </Card>
  )
}

const getChartDimensions = (dimensions) => ({
  width: dimensions.width,
  height: 400,
})

const Charts = () => {
  const {translate: tr, formatAdaSplit} = useI18n()
  const [xAxis, setXAxis] = useState(X_AXIS.DAY)
  const [dimensions, setDimensions] = useState({width: -1, height: -1})

  const {error, loading, currentEpoch} = useCurrentEpoch()

  const tabNames = ObjectValues(TAB_NAMES)
  const tabState = useTabState(tabNames)

  // Note: For now not showing decimals, as then values are too long
  const formatAdaValue = (value) => formatAdaSplit(value).integral
  const onXAxisChange = useCallback((e) => setXAxis(e.target.value), [setXAxis])

  const commonChartProps = {
    xLabel: tr(xAxis === X_AXIS.DAY ? xLabels.day : xLabels.epoch),
    formatX: xAxis === X_AXIS.DAY ? formatDay : identity,
    ...getChartDimensions(dimensions),
  }

  const xAxisProps = {
    value: xAxis,
    onChange: onXAxisChange,
  }

  // TODO: calculate number of ticks based on dimensions
  return (
    <SimpleLayout title={tr(messages.header)} maxWidth="1200px">
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
                  formatY={formatAdaValue}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                  {...{loading, error, currentEpoch}}
                />
              </Tab>

              <Tab name={TAB_NAMES.TRANSACTIONS_COUNT}>
                <ChartTab
                  seriesType="txCount"
                  yLabel={tr(yLabels.txCount)}
                  formatY={identity}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                  {...{loading, error, currentEpoch}}
                />
              </Tab>

              <Tab name={TAB_NAMES.TOTAL_UTXO}>
                <ChartTab
                  seriesType="totalUtxoCreated"
                  yLabel={tr(yLabels.utxo)}
                  formatY={identity}
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
