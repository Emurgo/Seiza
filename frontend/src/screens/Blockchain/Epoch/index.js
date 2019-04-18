// @flow
import React, {useRef} from 'react'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useQuery} from 'react-apollo-hooks'
import idx from 'idx'
import useReactRouter from 'use-react-router'
import {Link} from 'react-router-dom'
import {Card} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {
  SummaryCard,
  SimpleLayout,
  EntityIdCard,
  LoadingError,
  AdaValue,
  Tab,
  Tabs,
  Button,
  Overlay,
  LoadingOverlay,
} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/assets/icons/metrics-epoch.svg'
import WithTabState from '@/components/headless/tabState'
import Blocks from './Blocks'
import StakingPoolsTab from './StakingPools'
import {routeTo} from '@/helpers/routes'
import config from '@/config'
import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import {ReactComponent as NextEpochIcon} from '@/assets/icons/next-epoch.svg'
import {ReactComponent as PreviousEpochIcon} from '@/assets/icons/previous-epoch.svg'

const messages = defineMessages({
  notAvailable: 'N/A',
  goPreviousEpoch: 'Previous Epoch',
  goNextEpoch: 'Next Epoch',
  header: 'Epoch',
  entityHeader: 'Epoch Number',
  startTime: 'Start Time',
  endTime: 'End Time',
  blocksCount: 'Blocks',
  blocksOutOfSlots: '{blocks} out of {slots} slots',
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
    [TAB_NAMES.BLOCKS]: Blocks,
    [TAB_NAMES.STAKING_POOLS]: StakingPoolsTab,
  },
}

const EpochSummaryCard = ({epoch, loading}) => {
  const {Row, Label, Value} = SummaryCard
  const {translate, formatTimestamp, formatInt} = useI18n()
  const NA = translate(messages.notAvailable)

  const data1 = {
    startTime: formatTimestamp(idx(epoch, (_) => _.startTime), {defaultValue: NA}),
    endTime: formatTimestamp(idx(epoch, (_) => _.endTime), {defaultValue: NA}),
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
      <Row>
        <Label>{translate(messages.totalAdaCirculation)}</Label>
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

const useStyles = makeStyles((theme) => ({
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationButton: {
    width: '250px',
    margin: '0 30px',
    position: 'relative',
  },
  prevEpochIcon: {
    position: 'absolute',
    left: 15,
  },
  nextEpochIcon: {
    position: 'absolute',
    right: 15,
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

// https://github.com/trojanowski/react-apollo-hooks/issues/117
// Note: this will hopefully go away in the next version of react-apollo-hooks
const useQueryNotBugged = (...args) => {
  const [notNullData, setNotNullData] = React.useState({})
  const {data, error, loading} = useQuery(...args)

  React.useEffect(() => {
    if (data && !loading) {
      setNotNullData(data)
    }
  }, [data, loading])

  return {data: notNullData, error, loading}
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
  const classes = useStyles()
  const {translate} = useI18n()

  const epochNavigation = useEpochNavigation(currentEpochNumber)
  return (
    <div className={classes.navigation}>
      <Button
        rounded
        secondary
        onClick={epochNavigation.goPrev}
        className={classes.navigationButton}
        disabled={!epochNavigation.hasPrev}
        to={epochNavigation.linkPrev}
        component={Link}
      >
        <PreviousEpochIcon className={classes.prevEpochIcon} />
        {translate(messages.goPreviousEpoch)}
      </Button>
      <Button
        rounded
        secondary
        className={classes.navigationButton}
        onClick={epochNavigation.goNext}
        disabled={!epochNavigation.hasNext}
        to={epochNavigation.linkNext}
        component={Link}
      >
        {translate(messages.goNextEpoch)}
        <NextEpochIcon className={classes.nextEpochIcon} />
      </Button>
    </div>
  )
}

const EpochScreen = () => {
  const {epochNumber} = useScreenParams()
  const {epochData, error, loading} = useEpochData(epochNumber)
  const scrollToRef = useRef()

  const {translate} = useI18n()
  const blocksInEpoch = idx(epochData, (_) => _.summary.blocksCreated)

  useScrollFromBottom(scrollToRef, epochData)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={translate(messages.header)}>
        <EpochNavigation currentEpochNumber={epochNumber} />
        <EntityIdCard
          showCopyIcon={false}
          label={translate(messages.entityHeader)}
          value={epochNumber}
          iconRenderer={<img alt="" src={EpochIcon} width={40} height={40} />}
          appearAnimation
          rawValue={epochNumber}
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
                        <Tab label={translate(messages.blocksTab)} />
                        <Tab label={translate(messages.stakingPoolsTab)} />
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
