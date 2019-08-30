import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {SummaryCard, Card, ContentSpacing} from '@/components/visual'
import {AdaValue, PoolEntityContent, Link} from '@/components/common'
import {routeTo} from '@/helpers/routes'

const delegatedPoolMessages = defineMessages({
  stakePoolPosition: 'Stake Pool Position',
  marginDiff: 'Stake Pool Margin Difference with Top #1',
  costDiff: 'Stake Pool Cost Difference with Top #1',
  perfDiff: 'Stake Pool Performance diff with Top #1',
  currentTopStakePool: 'Current Top Stake Pool',
  epochsLabel: 'Epochs in current stake pool',
  epochsValue: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
})

const DelegatedPoolInfoTab = ({stakePool, epochsInCurrentStakepool}) => {
  const {translate, formatInt, formatPercent} = useI18n()
  const {Row, Label, Value} = SummaryCard

  return (
    <Card>
      <ContentSpacing bottom={0.75} top={0.75}>
        <PoolEntityContent name={stakePool.name} hash={stakePool.hash} />
      </ContentSpacing>

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
          <Typography variant="body1" color="textSecondary">
            {stakePool.topPoolComparison.topPool.name}
          </Typography>
          <Typography variant="body1">
            <Link monospace to={routeTo.stakepool(stakePool.topPoolComparison.topPool.hash)}>
              {stakePool.topPoolComparison.topPool.hash}
            </Link>
          </Typography>
        </Value>
      </Row>
      <Row>
        <Label>{translate(delegatedPoolMessages.epochsLabel)}</Label>
        <Value>
          {translate(delegatedPoolMessages.epochsValue, {
            count: formatInt(epochsInCurrentStakepool),
          })}
        </Value>
      </Row>
    </Card>
  )
}

export default DelegatedPoolInfoTab
