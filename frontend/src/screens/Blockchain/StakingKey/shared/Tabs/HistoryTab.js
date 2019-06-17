import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {SummaryCard, AdaValue} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/assets/icons/epoch.svg'

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    borderTop: `1px solid ${theme.palette.contentUnfocus}`,
    padding: theme.spacing(2),
  },
  header: {
    'paddingTop': theme.spacing(1),
    'textTransform': 'uppercase',
    '& > *': {
      paddingRight: theme.spacing(1),
    },
  },
}))

const messages = defineMessages({
  epoch: 'Epoch: ',
  COST: 'Stake Pool cost:',
  MARGIN: 'Stake Pool margins:',
  PLEDGE_CHANGE: 'Stake Pool pledge change:',
  WITHDRAWAL: 'Stake Pool moved out funds:',
  historyName: 'History',
})

const MarginAction = ({total, change}) => {
  const {formatPercent} = useI18n()
  return `${formatPercent(total, {showSign: 'always'})} (${formatPercent(change, {
    showSign: 'always',
  })})`
}

const CostAction = ({value}) => {
  return <AdaValue value={value} showCurrency showSign="always" />
}

const WithdrawalAction = ({value}) => {
  return (
    <React.Fragment>
      (<AdaValue value={value} showCurrency showSign="always" />)
    </React.Fragment>
  )
}

const PledgeAction = ({value}) => {
  return <AdaValue value={value} showCurrency showSign="always" />
}

const ACTION_RENDERERS = {
  COST: CostAction,
  MARGIN: MarginAction,
  PLEDGE_CHANGE: PledgeAction,
  WITHDRAWAL: WithdrawalAction,
}

const EpochHeader = ({epochNumber}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <Grid container direction="row" className={classes.header}>
      <Grid item>
        <img alt="" src={EpochIcon} />{' '}
      </Grid>
      <Grid item>
        <Typography variant="caption" component="span" color="textSecondary">
          {tr(messages.epoch)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption" component="span">
          {epochNumber}
        </Typography>
      </Grid>
    </Grid>
  )
}

// TODO: add shadow effect on hover
const HistoryTab = ({history}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  const {Row, Label, Value} = SummaryCard
  return history.map(({epochNumber, actions}, index) => (
    <div className={classes.headerWrapper} key={index}>
      <EpochHeader epochNumber={epochNumber} />
      {actions.map((action, index) => {
        const label = tr(messages[action.type])
        const ActionValue = ACTION_RENDERERS[action.type]
        return (
          <Row key={index} className={classes.actionRow}>
            <Label>
              <Typography variant="body1" color="textSecondary">
                {label}
              </Typography>
            </Label>
            <Value>
              <ActionValue {...action} />
            </Value>
          </Row>
        )
      })}
    </div>
  ))
}

export default HistoryTab
