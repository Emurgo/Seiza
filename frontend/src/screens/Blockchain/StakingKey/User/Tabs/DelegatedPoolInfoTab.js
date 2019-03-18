import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import {SummaryCard, AdaValue} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const delegatedPoolMessages = defineMessages({
  stakePool: 'Stake Pool',
  stakePoolPosition: 'Stake Pool Position',
  marginDiff: 'Stake Pool Margin Difference with Top #1',
  costDiff: 'Stake Pool Cost Difference with Top #1',
  perfDiff: 'Stake Pool Performance diff with Top #1',
  currentTopStakePool: 'Current Top Stake Pool',
  epochsLabel: 'Epochs in current stake pool',
  epochsValue: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
})

const DelegatedPoolInfoTab = ({stakePool, epochsInCurrentStakePool}) => {
  const {translate, formatInt, formatPercent} = useI18n()
  const {Row, Label, Value} = SummaryCard

  return (
    <SummaryCard>
      <Row>
        <Label>{translate(delegatedPoolMessages.stakePool)}</Label>
        <Value>
          {stakePool.name} {stakePool.hash}
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.stakePoolPosition)}</Label>
        <Value>#{formatInt(stakePool.topPoolComparison.position)}</Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.marginDiff)}</Label>
        <Value>
          {formatPercent(stakePool.currentMargin.margin)} (
          {formatPercent(stakePool.topPoolComparison.margin, {withSign: true})})
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.costDiff)}</Label>
        <Value>
          <AdaValue value={stakePool.currentCost.cost} showCurrency /> (
          <AdaValue value={stakePool.topPoolComparison.cost} showCurrency />)
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.perfDiff)}</Label>
        <Value>
          {formatPercent(stakePool.performance)} (
          {formatPercent(stakePool.topPoolComparison.performance, {withSign: true})})
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.currentTopStakePool)}</Label>
        <Value>
          <Typography variant="body1" color="textSecondary" align="right">
            {stakePool.topPoolComparison.topPool.name}
          </Typography>
          <Typography variant="body1" align="right">
            {stakePool.topPoolComparison.topPool.hash}
          </Typography>
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.epochsLabel)}</Label>
        <Value>
          {translate(delegatedPoolMessages.epochsValue, {
            count: formatInt(epochsInCurrentStakePool),
          })}
        </Value>
      </Row>
    </SummaryCard>
  )
}

export default DelegatedPoolInfoTab
