// @flow

import _ from 'lodash'
import Measure from 'react-measure'
import moment from 'moment'
import React, {useState, useCallback} from 'react'
import {defineMessages} from 'react-intl'
import {FormControl, RadioGroup, FormControlLabel, Radio} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {ObjectValues} from '@/helpers/flow'
import {SimpleLayout, LiteTabs, LiteTab, Card} from '@/components/visual'
import useTabState from '@/components/hooks/useTabState'
import {TabsProvider as Tabs, TabItem as Tab, useTabContext} from '@/components/context/TabContext'
import BarChart from './BarChart'

const messages = defineMessages({
  header: 'Charts',
  totalSentBar: 'Total ADA Sent',
  transactionsCount: 'Transactions Count',
  totalUtxo: 'Total UTXO',
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

// >>>> TODO: get real data
const generateEpochData = (fromEpoch, count, unit) => {
  return _.range(fromEpoch - count, fromEpoch + 1).map((epochNumber) => ({
    x: epochNumber,
    y: Math.floor(Math.random() * unit),
  }))
}

const generateDayData = (count, unit) => {
  const m = moment('20.03.2014', 'DD.MM.YYYY')
  return _.range(0, count).map(() => ({
    x: m.add(1, 'days').valueOf(),
    y: Math.floor(Math.random() * unit),
  }))
}

const totalAdaEpochData = generateEpochData(30, 20, 1000000000000000)
const totalAdaDayData = generateDayData(30, 10000000000000)

const transactionsEpochData = generateEpochData(30, 20, 100000)
const transactionsDayData = generateDayData(30, 1000)

const utxoEpochData = generateEpochData(30, 20, 100000)
const utxoDayData = generateDayData(30, 1000)

// <<<< TODO: get real data

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

// Note: we could closure common props, but it does not play well with hooks
const ChartTab = ({commonChartProps, xAxisProps, formatY, data, yLabel}) => {
  // TODO
  if (!data.length) return null

  return (
    <Card>
      <XAxisSwitch {...xAxisProps} />
      <BarChart {...{data, yLabel, formatY}} {...commonChartProps} />
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
                  data={xAxis === X_AXIS.DAY ? totalAdaDayData : totalAdaEpochData}
                  yLabel={tr(yLabels.adaSent)}
                  formatY={formatAdaValue}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                />
              </Tab>

              <Tab name={TAB_NAMES.TRANSACTIONS_COUNT}>
                <ChartTab
                  data={xAxis === X_AXIS.DAY ? transactionsDayData : transactionsEpochData}
                  yLabel={tr(yLabels.txCount)}
                  formatY={identity}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
                />
              </Tab>

              <Tab name={TAB_NAMES.TOTAL_UTXO}>
                <ChartTab
                  data={xAxis === X_AXIS.DAY ? utxoDayData : utxoEpochData}
                  yLabel={tr(yLabels.utxo)}
                  formatY={identity}
                  commonChartProps={commonChartProps}
                  xAxisProps={xAxisProps}
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
