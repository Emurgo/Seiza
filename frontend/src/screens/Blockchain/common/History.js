import React from 'react'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {Card} from '@/components/visual'
import {PoolEntityContent, SeparatorWithLabel} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/static/assets/icons/epoch.svg'
import CertificateActionList from '@/screens/Blockchain/Certificates/ActionList'

const useStyles = makeStyles(({palette, spacing, breakpoints, getContentSpacing}) => ({
  headerWrapper: {
    marginBottom: spacing(3),
  },
  header: {
    'backgroundColor': palette.unobtrusiveContentHighlight,
    '& > *': {
      paddingRight: spacing(1),
    },
  },
  spacings: {
    paddingLeft: getContentSpacing(0.5),
    paddingRight: getContentSpacing(0.5),
    paddingBottom: getContentSpacing(0.5),
    paddingTop: getContentSpacing(0.5),
    [breakpoints.up('sm')]: {
      paddingLeft: getContentSpacing(),
      paddingRight: getContentSpacing(),
    },
  },
  poolHistory: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
}))

const messages = defineMessages({
  epoch: 'Epoch: ',
  currentEpoch: 'Current epoch:',
  FEE: 'Stake Pool fee:',
  MARGIN: 'Stake Pool margins:',
  PLEDGE_CHANGE: 'Stake Pool pledge change:',
  WITHDRAWAL: 'Stake Pool moved out funds:',
  historyName: 'History',
  actions: 'Actions:',
})

const formatFutureEpochValue = (epochNumber, currentEpochNumber) => {
  return `${epochNumber} (${currentEpochNumber} + ${epochNumber - currentEpochNumber})`
}

const EpochValue = ({epochNumber, currentEpochNumber}) => {
  return epochNumber > currentEpochNumber
    ? formatFutureEpochValue(epochNumber, currentEpochNumber)
    : epochNumber
}

const EpochHeader = ({epochNumber, currentEpochNumber}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  const epochLabel = tr(epochNumber === currentEpochNumber ? messages.currentEpoch : messages.epoch)

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={cn(classes.header, classes.spacings)}
    >
      <img alt="" src={EpochIcon} />{' '}
      <Typography variant="overline" component="span" color="textSecondary">
        {epochLabel}
      </Typography>
      <Typography variant="overline" component="span">
        <EpochValue epochNumber={epochNumber} currentEpochNumber={currentEpochNumber} />
      </Typography>
    </Grid>
  )
}

const CertificatesCount = ({count}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  return (
    <div className={classes.spacings}>
      <Typography variant="overline" component="span" color="textSecondary">
        {tr(messages.actions)}
      </Typography>{' '}
      <Typography variant="overline" component="span">
        {count}
      </Typography>
    </div>
  )
}

const History = ({history}) => {
  const classes = useStyles()
  return history.map(({epochNumber, certificateActions}, index) => (
    <Card className={classes.headerWrapper} key={index}>
      <EpochHeader epochNumber={epochNumber} />
      <CertificatesCount count={certificateActions.length} />
      <CertificateActionList showTxHash actions={certificateActions} />
    </Card>
  ))
}

const PoolEntityContentHeader = ({children}) => {
  const classes = useStyles()
  return <div className={cn(classes.header, classes.spacings)}>{children}</div>
}

const EpochSeparator = ({epochNumber, currentEpochNumber}) => {
  const {translate: tr} = useI18n()

  const epochLabel = tr(epochNumber === currentEpochNumber ? messages.currentEpoch : messages.epoch)

  return (
    <Grid container alignItems="center">
      <SeparatorWithLabel>
        <img alt="" src={EpochIcon} />
        &nbsp;
        <Typography variant="overline" component="span" color="textSecondary">
          {epochLabel}
        </Typography>
        &nbsp;
        <Typography variant="overline" component="span">
          <EpochValue epochNumber={epochNumber} currentEpochNumber={currentEpochNumber} />
        </Typography>
      </SeparatorWithLabel>
    </Grid>
  )
}

export const HistoryMultiplePools = ({poolsHistory, currentEpochNumber}) => {
  const classes = useStyles()
  return poolsHistory.map(({epochNumber, poolHistories}) => (
    <div key={epochNumber}>
      <EpochSeparator epochNumber={epochNumber} currentEpochNumber={currentEpochNumber} />
      {poolHistories.map(({name, poolHash, history: [{certificateActions}]}) => (
        <Card key={poolHash} className={classes.poolHistory}>
          <PoolEntityContentHeader>
            <PoolEntityContent hash={poolHash} name={name} />
          </PoolEntityContentHeader>

          <CertificatesCount count={certificateActions.length} />
          <CertificateActionList showTxHash actions={certificateActions} />
        </Card>
      ))}
    </div>
  ))
}

export default History
