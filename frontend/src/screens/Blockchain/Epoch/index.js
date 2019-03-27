// @flow
import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import idx from 'idx'
import useReactRouter from 'use-react-router'

import {Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {
  SummaryCard,
  SimpleLayout,
  EntityIdCard,
  LoadingDots,
  LoadingError,
  AdaValue,
  Tab,
  Tabs,
  Button,
} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/assets/icons/metrics-epoch.svg'
import WithTabState from '@/components/headless/tabState'
import BlocksTab from './Blocks'
import StakingPoolsTab from './StakingPools'
import {routeTo} from '@/helpers/routes'

const messages = defineMessages({
  goPreviousEpoch: '← Previous Epoch',
  goNextEpoch: 'Next Epoch →',
  header: 'Epoch',
  entityHeader: 'Epoch Number',
  startTime: 'Start Time',
  endTime: 'End Time',
  blocksCount: 'Blocks',
  txCount: 'Transactions',
  totalAdaCirculation: 'Total ADA Circulation',
  totalFees: 'Total Fees',
  totalAdaStaked: 'Total ADA Staked',
  totalStakingRewards: 'Total Staking Rewards',
  stakingKeysDelegating: 'Total Staking Keys Delegating',
  stakingPoolsCount: 'Total Pools Count',
  blocksTab: 'Blocks',
  stakingPoolsTab: 'Staking Pools',
})

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
    [TAB_NAMES.BLOCKS]: BlocksTab,
    [TAB_NAMES.STAKING_POOLS]: StakingPoolsTab,
  },
}

const EpochSummaryCard = ({epoch, loading}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate, formatTimestamp, formatInt} = useI18n()
  const NA = loading ? <LoadingDots /> : 'N/A'

  // If we are loading, do not show old data
  epoch = loading ? null : epoch

  const data1 = {
    startTime: formatTimestamp(idx(epoch, (_) => _.startTime), {defaultValue: NA}),
    endTime: formatTimestamp(idx(epoch, (_) => _.endTime), {defaultValue: NA}),

    blocksCount: formatInt(idx(epoch, (_) => _.summary.blocksCreated), {defaultValue: NA}),

    txCount: formatInt(idx(epoch, (_) => _.summary.transactionCount), {defaultValue: NA}),
  }

  const card1 = (
    <SummaryCard>
      <Row>
        <Label>{translate(messages.startTime)}</Label>
        <Value>{data1.startTime}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.endTime)}</Label>
        <Value>{data1.endTime}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.blocksCount)}</Label>
        <Value>{data1.blocksCount}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.txCount)}</Label>
        <Value>{data1.txCount}</Value>
      </Row>
    </SummaryCard>
  )

  const data2 = {
    totalAdaSupply: (
      <AdaValue value={idx(epoch, (_) => _.summary.totalAdaSupply)} noValue={NA} showCurrency />
    ),
    epochFees: (
      <AdaValue value={idx(epoch, (_) => _.summary.epochFees)} noValue={NA} showCurrency />
    ),
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
        <Label>{translate(messages.totalAdaCirculation)}</Label>
        <Value>{data2.totalAdaSupply}</Value>
      </Row>
      <Row>
        <Label>{translate(messages.totalFees)}</Label>
        <Value>{data2.epochFees}</Value>
      </Row>
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
      {card1}
      {card2}
    </React.Fragment>
  )
}

const useStyles = makeStyles((theme) => ({
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationButton: {
    width: '250px',
    margin: '0 30px',
  },
}))

const useEpochNavigation = (epochNumber: number) => {
  const {history} = useReactRouter()

  const linkPrev = routeTo.epoch(epochNumber - 1)
  const linkNext = routeTo.epoch(epochNumber + 1)

  // TODO: memoize using useCallback
  const goPrev = () => {
    history.push(linkPrev)
  }
  const goNext = () => {
    history.push(linkNext)
  }

  return {
    hasPrev: epochNumber > 0,
    linkPrev,
    goPrev,
    hasNext: epochNumber != null, // For now we always have more epochs
    linkNext,
    goNext,
  }
}

const EpochScreen = ({router, epochNumber, epochDataProvider, match, tab, tabOrder, setTab}) => {
  const {translate} = useI18n()
  const {epoch, error, loading} = epochDataProvider
  const classes = useStyles()

  const epochNavigation = useEpochNavigation(epochNumber)

  return (
    <SimpleLayout title={translate(messages.header)}>
      <div className={classes.navigation}>
        <Button
          rounded
          secondary
          onClick={epochNavigation.goPrev}
          className={classes.navigationButton}
          disabled={!epochNavigation.hasPrev}
        >
          {translate(messages.goPreviousEpoch)}
        </Button>
        <Button
          rounded
          secondary
          className={classes.navigationButton}
          onClick={epochNavigation.goNext}
          disabled={!epochNavigation.hasNext}
        >
          {translate(messages.goNextEpoch)}
        </Button>
      </div>
      <EntityIdCard
        label={translate(messages.entityHeader)}
        value={epochNumber}
        iconRenderer={<img alt="" src={EpochIcon} width={40} height={40} />}
      />
      {error ? (
        <LoadingError error={error} />
      ) : (
        <React.Fragment>
          <EpochSummaryCard epoch={epoch} loading={loading} />
          <WithTabState tabNames={TABS.ORDER}>
            {({setTab, currentTab, currentTabName}) => {
              const TabContent = TABS.CONTENT[currentTabName]
              return (
                <Paper>
                  <Tabs value={currentTab} onChange={setTab}>
                    <Tab label={translate(messages.blocksTab)} />
                    <Tab label={translate(messages.stakingPoolsTab)} />
                  </Tabs>
                  <TabContent epochNumber={epochNumber} />
                </Paper>
              )
            }}
          </WithTabState>
        </React.Fragment>
      )}
    </SimpleLayout>
  )
}

export default compose(
  withRouter,
  withProps((props) => ({
    epochNumber: parseInt(props.match.params.epoch, 10),
  })),
  graphql(GET_EPOCH_BY_NUMBER, {
    name: 'epochDataProvider',
    options: ({epochNumber}) => ({
      variables: {epochNumber},
    }),
  })
)(EpochScreen)
