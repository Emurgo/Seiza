import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {ContentSpacing, Card, Divider} from '@/components/visual'
import {PoolEntityContent} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/static/assets/icons/epoch.svg'
import CertificateActionList from '@/screens/Blockchain/Certificates/ActionList'

const useStyles = makeStyles(({palette, spacing}) => ({
  headerWrapper: {
    marginBottom: spacing(3),
  },
  header: {
    'backgroundColor': palette.unobtrusiveContentHighlight,
    '& > *': {
      paddingRight: spacing(1),
    },
  },
}))

const messages = defineMessages({
  epoch: 'Epoch: ',
  currentEpoch: 'Current epoch:',
  COST: 'Stake Pool cost:',
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
    <ContentSpacing top={0.5} bottom={0.5} className={classes.header}>
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <img alt="" src={EpochIcon} />{' '}
        <Typography variant="overline" component="span" color="textSecondary">
          {epochLabel}
        </Typography>
        <Typography variant="overline" component="span">
          <EpochValue epochNumber={epochNumber} currentEpochNumber={currentEpochNumber} />
        </Typography>
      </Grid>
    </ContentSpacing>
  )
}

const CertificatesCount = ({count}) => {
  const {translate: tr} = useI18n()

  return (
    <ContentSpacing top={0.5} bottom={0.5}>
      <Typography variant="overline" component="span" color="textSecondary">
        {tr(messages.actions)}
      </Typography>{' '}
      <Typography variant="overline" component="span">
        {count}
      </Typography>
    </ContentSpacing>
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

const DoubleDivider = () => (
  <React.Fragment>
    <Divider />
    <Divider />
  </React.Fragment>
)

export const HistoryMultiplePools = ({poolsHistory, currentEpochNumber}) => {
  return poolsHistory.map(({epochNumber, poolHistories}) => (
    <Card key={epochNumber}>
      <EpochHeader epochNumber={epochNumber} currentEpochNumber={currentEpochNumber} />
      {poolHistories.map(({name, poolHash, history: [{certificateActions}]}, index) => (
        <React.Fragment key={poolHash}>
          {index > 0 && <DoubleDivider />}
          <ContentSpacing bottom={0.5} top={1.5}>
            <PoolEntityContent hash={poolHash} name={name} />
          </ContentSpacing>
          <CertificatesCount count={certificateActions.length} />
          <CertificateActionList showTxHash actions={certificateActions} />
        </React.Fragment>
      ))}
    </Card>
  ))
}

export default History
