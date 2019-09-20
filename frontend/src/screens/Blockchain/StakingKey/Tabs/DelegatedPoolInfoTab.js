import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {SummaryCard, Card} from '@/components/visual'
import {AdaValue, PoolEntityContent, Link, Ellipsize} from '@/components/common'
import {routeTo} from '@/helpers/routes'

const useStyles = makeStyles(({getContentSpacing, breakpoints}) => ({
  spacings: {
    paddingLeft: getContentSpacing(0.5),
    paddingRight: getContentSpacing(0.5),
    paddingBottom: getContentSpacing(0.5),
    paddingTop: getContentSpacing(0.75),
    [breakpoints.up('sm')]: {
      paddingLeft: getContentSpacing(),
      paddingRight: getContentSpacing(),
    },
  },
}))

const delegatedPoolMessages = defineMessages({
  stakePoolPosition: 'Stake Pool Position',
  marginDiff: 'Stake Pool Margin Difference with Top #1',
  feeDiff: 'Stake Pool Fee Difference with Top #1',
  perfDiff: 'Stake Pool Performance diff with Top #1',
  currentTopStakePool: 'Current Top Stake Pool',
  epochsLabel: 'Epochs in current stake pool',
  epochsValue: '{count, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
})

const DelegatedPoolInfoTab = ({stakePool, epochsInCurrentStakepool}) => {
  const {translate, formatInt, formatPercent} = useI18n()
  const {Row, Label, Value} = SummaryCard
  const classes = useStyles()

  return (
    <Card>
      <div className={classes.spacings}>
        <PoolEntityContent name={stakePool.name} hash={stakePool.hash} />
      </div>

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
        <Label>{translate(delegatedPoolMessages.feeDiff)}</Label>
        <Value>
          <AdaValue value={stakePool.currentFee.fee} showCurrency /> (
          <AdaValue value={stakePool.topPoolComparison.fee} showCurrency />)
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
              <Ellipsize value={stakePool.topPoolComparison.topPool.hash} />
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
