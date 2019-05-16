// @flow
import React, {useRef} from 'react'
import {defineMessages} from 'react-intl'
import moment from 'moment-timezone'
import gql from 'graphql-tag'
import idx from 'idx'
import useReactRouter from 'use-react-router'
import {Card, Grid, Chip, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {
  SummaryCard,
  SimpleLayout,
  EntityCardContent,
  EntityCardShell,
  LoadingError,
  AdaValue,
  Tab,
  Tabs,
  Overlay,
  LoadingOverlay,
} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EpochNumberIcon from '@/assets/icons/epoch-number.svg'
import EpochIcon from '@/assets/icons/metrics-epoch.svg'
import WithTabState from '@/components/headless/tabState'
import Blocks from './Blocks'
import StakingPoolsTab from './StakingPools'
import {routeTo} from '@/helpers/routes'
import config from '@/config'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {useAnalytics} from '@/helpers/googleAnalytics'

import NavigationButtons from '../NavigationButtons'

const messages = defineMessages({
  notAvailable: 'N/A',
  goPreviousEpoch: 'Previous Epoch',
  goNextEpoch: 'Next Epoch',
  header: 'Epoch',
  entityHeader: 'Epoch Number',
  timePeriod: 'Time Period',
  blocksCount: 'Blocks',
  blocksOutOfSlots: '{blocks} out of {slots} slots',
  txCount: 'Transactions',
  totalAdaSupply: 'Total ADA supply',
  totalFees: 'Total Fees',
  totalAdaStaked: 'Total ADA Staked',
  totalStakingRewards: 'Total Staking Rewards',
  stakingKeysDelegating: 'Total Staking Keys Delegating',
  stakingPoolsCount: 'Total Pools Count',
  blocksTab: 'Blocks',
  stakingPoolsTab: 'Staking Pools',
  future: 'Future',
  current: 'Current',
})

const useStyles = makeStyles((theme) => ({
  timeHeader: {
    marginTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  chip: {
    // TODO: use color from theme someday
    color: 'white',
    background: '#ABABAB',
    textTransform: 'uppercase',
    marginRight: theme.spacing.unit,
  },
  date: {
    display: 'inline-block',
    fontStyle: ({chipLabel}) => (chipLabel ? 'italic' : 'normal'),
  },
}))

const GET_EPOCH_BY_NUMBER = gql`
  query($epochNumber: Int!) {
    epoch(epochNumber: $epochNumber) {
      startTime
      endTime
      progress
      summary {
        slotCount
        blocksCreated
        transactionCount
        totalAdaSupply
        epochFees
        totalAdaStaked
        stakingRewards
        delegatingStakingKeysCount
        activeStakingPoolCount
      }
    }
  }
`
const TAB_NAMES = {
  BLOCKS: 'BLOCKS',
  STAKING_POOLS: 'STAKING_POOLS',
}

const TABS = {
  ORDER: [TAB_NAMES.BLOCKS, TAB_NAMES.STAKING_POOLS],
  CONTENT: {
    [TAB_NAMES.BLOCKS]: Blocks,
    [TAB_NAMES.STAKING_POOLS]: StakingPoolsTab,
  },
}

const EpochSummaryCard = ({epoch, loading}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate, formatInt} = useI18n()
  const NA = translate(messages.notAvailable)

  const data1 = {
    blocksCount: translate(messages.blocksOutOfSlots, {
      blocks: formatInt(idx(epoch, (_) => _.summary.blocksCreated), {defaultValue: NA}),
      slots: formatInt(idx(epoch, (_) => _.summary.slotCount), {defaultValue: NA}),
    }),
    txCount: formatInt(idx(epoch, (_) => _.summary.transactionCount), {defaultValue: NA}),
    totalAdaSupply: (
      <AdaValue value={idx(epoch, (_) => _.summary.totalAdaSupply)} noValue={NA} showCurrency />
    ),
    epochFees: (
      <AdaValue value={idx(epoch, (_) => _.summary.epochFees)} noValue={NA} showCurrency />
    ),
  }

  const card1 = (
    <SummaryCard>
      <Row>
        <Label>{translate(messages.blocksCount)}</Label>
        <Value>{data1.blocksCount}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.txCount)}</Label>
        <Value>{data1.txCount}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.totalAdaSupply)}</Label>
        <Value>{data1.totalAdaSupply}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.totalFees)}</Label>
        <Value>{data1.epochFees}</Value>
      </Row>
    </SummaryCard>
  )

  const data2 = {
    totalAdaStaked: (
      <AdaValue value={idx(epoch, (_) => _.summary.totalAdaStaked)} noValue={NA} showCurrency />
    ),
    totalStakingRewards: (
      <AdaValue
        value={idx(epoch, (_) => _.summary.totalStakingRewards)}
        noValue={NA}
        showCurrency
      />
    ),
    stakingKeysDelegating: formatInt(idx(epoch, (_) => _.summary.delegatingStakingKeysCount), {
      defaultValue: NA,
    }),
    stakingPoolsCount: formatInt(idx(epoch, (_) => _.summary.activeStakingPoolCount), {
      defaultValue: NA,
    }),
  }

  const card2 = (
    <SummaryCard>
      <Row>
        <Label>{translate(messages.totalAdaStaked)}</Label>
        <Value>{data2.totalAdaStaked}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.totalStakingRewards)}</Label>
        <Value>{data2.totalStakingRewards}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.stakingKeysDelegating)}</Label>
        <Value>{data2.stakingKeysDelegating}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.stakingPoolsCount)}</Label>
        <Value>{data2.stakingPoolsCount}</Value>
      </Row>
    </SummaryCard>
  )

  return (
    <React.Fragment>
      <Overlay.Wrapper>
        {card1}
        <LoadingOverlay loading={loading} />
      </Overlay.Wrapper>
      {config.showStakingData && (
        <Overlay.Wrapper>
          {card2}
          <LoadingOverlay loading={loading} />
        </Overlay.Wrapper>
      )}
    </React.Fragment>
  )
}

const useEpochNavigation = (epochNumber: number) => {
  const linkPrev = routeTo.epoch(epochNumber - 1)
  const linkNext = routeTo.epoch(epochNumber + 1)

  return {
    hasPrev: epochNumber > 0,
    linkPrev,
    hasNext: epochNumber != null, // For now we always have more epochs
    linkNext,
  }
}

const useEpochData = (epochNumber) => {
  const {loading, error, data} = useQueryNotBugged(GET_EPOCH_BY_NUMBER, {
    variables: {epochNumber},
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  })
  return {
    loading,
    error,
    epochData: data.epoch,
  }
}

const useScreenParams = () => {
  const {
    match: {
      params: {epoch: epochStr},
    },
  } = useReactRouter()
  const epochNumber = parseInt(epochStr, 10)
  return {epochNumber}
}

const EpochNavigation = ({currentEpochNumber}) => {
  const {translate} = useI18n()

  const nav = useEpochNavigation(currentEpochNumber)
  return (
    <NavigationButtons
      {...nav}
      prevMessage={translate(messages.goPreviousEpoch)}
      nextMessage={translate(messages.goNextEpoch)}
    />
  )
}

const getIsInFuture = (ts) => (ts ? moment(ts).isAfter(moment()) : false)

const EpochEntityCard = ({epochNumber, startTime, endTime}) => {
  const {translate: tr, formatTimestamp} = useI18n()
  const NA = tr(messages.notAvailable)
  const start = formatTimestamp(startTime, {
    format: formatTimestamp.FMT_MONTH_NUMERAL,
    defaultValue: NA,
  })
  const end = formatTimestamp(endTime, {
    format: formatTimestamp.FMT_MONTH_NUMERAL,
    defaultValue: NA,
  })
  const isInFuture = getIsInFuture(startTime)
  const isCurrent = getIsInFuture(endTime) && !getIsInFuture(startTime)
  const chipLabel =
    isInFuture || isCurrent ? tr(isInFuture ? messages.future : messages.current) : null
  const classes = useStyles({chipLabel})

  return (
    <EntityCardShell>
      <Grid container alignItems="center">
        <Grid item xs={12} md={4} lg={6}>
          <EntityCardContent
            showCopyIcon={false}
            label={tr(messages.entityHeader)}
            value={epochNumber}
            iconRenderer={<img alt="" src={EpochNumberIcon} width={48} height={48} />}
            appearAnimation
            rawValue={epochNumber}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={6} className={classes.timeHeader}>
          <EntityCardContent
            label={
              <span>
                {tr(messages.timePeriod)}{' '}
                {chipLabel && <Chip className={classes.chip} label={chipLabel} />}
              </span>
            }
            showCopyIcon={false}
            ellipsizeValue={false}
            iconRenderer={<img alt="" src={EpochIcon} width={48} height={48} />}
            value={
              <Typography variant="body1" inline className={classes.date}>
                {start} {' — '} {end}
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </EntityCardShell>
  )
}

const EpochScreen = () => {
  const {epochNumber} = useScreenParams()
  const {epochData, error, loading} = useEpochData(epochNumber)
  const scrollToRef = useRef()

  const {translate: tr} = useI18n()
  const blocksInEpoch = idx(epochData, (_) => _.summary.blocksCreated)

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('epoch')

  useScrollFromBottom(scrollToRef, epochData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={tr(messages.header)}>
        <EpochNavigation currentEpochNumber={epochNumber} />
        <EpochEntityCard
          epochNumber={epochNumber}
          startTime={idx(epochData, (_) => _.startTime)}
          endTime={idx(epochData, (_) => _.endTime)}
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <EpochSummaryCard epoch={epochData} loading={loading} />
            {config.showStakingData ? (
              <WithTabState tabNames={TABS.ORDER}>
                {({setTab, currentTab, currentTabName}) => {
                  const TabContent = TABS.CONTENT[currentTabName]
                  return (
                    <Card>
                      <Tabs value={currentTab} onChange={setTab}>
                        <Tab label={tr(messages.blocksTab)} />
                        <Tab label={tr(messages.stakingPoolsTab)} />
                      </Tabs>
                      <TabContent epochNumber={epochNumber} />
                    </Card>
                  )
                }}
              </WithTabState>
            ) : (
              blocksInEpoch != null &&
              blocksInEpoch > 0 && <Blocks epochNumber={epochNumber} blocksCount={blocksInEpoch} />
            )}
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default EpochScreen
