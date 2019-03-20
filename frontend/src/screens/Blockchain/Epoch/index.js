import React from 'react'
import {compose} from 'redux'
import {defineMessages} from 'react-intl'
import {withRouter} from 'react-router'
import {withProps} from 'recompose'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import idx from 'idx'
import {Paper} from '@material-ui/core'
import {
  SummaryCard,
  SimpleLayout,
  EntityIdCard,
  LoadingInProgress,
  DebugApolloError,
  AdaValue,
  Tab,
  Tabs,
} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import EpochIcon from '@/assets/icons/metrics-epoch.svg'
import WithTabState from '@/components/headless/tabState'
import BlocksTab from './Blocks'
import StakingPoolsTab from './StakingPools'

const messages = defineMessages({
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

const {Row, Label, Value} = SummaryCard
const EpochSummaryCard = withI18n(({i18n, epoch}) => {
  const {translate, formatTimestamp, formatInt} = i18n
  return (
    <React.Fragment>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.startTime)}</Label>
          <Value>{formatTimestamp(idx(epoch, (_) => _.startTime))}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.endTime)}</Label>
          <Value>{formatTimestamp(idx(epoch, (_) => _.endTime))}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.blocksCount)}</Label>
          <Value>{formatInt(idx(epoch, (_) => _.summary.blocksCreated))}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.txCount)}</Label>
          <Value>{formatInt(idx(epoch, (_) => _.summary.transactionCount))}</Value>
        </Row>
      </SummaryCard>
      <SummaryCard>
        <Row>
          <Label>{translate(messages.totalAdaCirculation)}</Label>
          <Value>
            <AdaValue value={idx(epoch, (_) => _.summary.totalAdaSupply)} /> ADA
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalFees)}</Label>
          <Value>
            <AdaValue value={idx(epoch, (_) => _.summary.epochFees)} /> ADA
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalAdaStaked)}</Label>
          <Value>
            <AdaValue value={idx(epoch, (_) => _.summary.totalAdaStaked)} /> ADA
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.totalStakingRewards)}</Label>
          <Value>
            <AdaValue value={idx(epoch, (_) => _.summary.stakingRewards)} /> ADA
          </Value>
        </Row>
        <Row>
          <Label>{translate(messages.stakingKeysDelegating)}</Label>
          <Value>{formatInt(idx(epoch, (_) => _.summary.delegatingStakingKeysCount))}</Value>
        </Row>
        <Row>
          <Label>{translate(messages.stakingPoolsCount)}</Label>
          <Value>{formatInt(idx(epoch, (_) => _.summary.activeStakingPoolCount))}</Value>
        </Row>
      </SummaryCard>
    </React.Fragment>
  )
})

const EpochScreen = ({i18n, epochNumber, epochDataProvider, match, tab, tabOrder, setTab}) => {
  const {translate} = i18n
  const {epoch, error, loading} = epochDataProvider

  return (
    <SimpleLayout title={translate(messages.header)}>
      {loading ? (
        <LoadingInProgress />
      ) : error ? (
        <DebugApolloError error={error} />
      ) : (
        <React.Fragment>
          <EntityIdCard
            label={translate(messages.entityHeader)}
            value={epochNumber}
            iconRenderer={<img alt="" src={EpochIcon} width={40} height={40} />}
          />
          <EpochSummaryCard epoch={epoch} />
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
  }),
  withI18n
)(EpochScreen)
