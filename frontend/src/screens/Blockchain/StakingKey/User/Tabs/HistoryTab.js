import React from 'react'
import {defineMessages} from 'react-intl'
import {Typography, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {ContentSpacing, Card} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import EpochIcon from '@/static/assets/icons/epoch.svg'
import {MOCKED_CERTIFICATES} from '@/screens/Blockchain/Certificates/helpers'
import CertificateList from '@/screens/Blockchain/Certificates/CertificateList'

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
  COST: 'Stake Pool cost:',
  MARGIN: 'Stake Pool margins:',
  PLEDGE_CHANGE: 'Stake Pool pledge change:',
  WITHDRAWAL: 'Stake Pool moved out funds:',
  historyName: 'History',
  actions: 'Actions:',
})

const EpochHeader = ({epochNumber}) => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <ContentSpacing top={0.5} bottom={0.5} className={classes.header}>
      <Grid container direction="row" alignItems="center" className={classes.header}>
        <img alt="" src={EpochIcon} />{' '}
        <Typography variant="overline" component="span" color="textSecondary">
          {tr(messages.epoch)}
        </Typography>
        <Typography variant="overline" component="span">
          {epochNumber}
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

const HistoryTab = ({history}) => {
  const classes = useStyles()
  return history.map(({epochNumber}, index) => (
    <Card className={classes.headerWrapper} key={index}>
      <EpochHeader epochNumber={epochNumber} />
      <CertificatesCount count={MOCKED_CERTIFICATES.length} />
      <CertificateList showTxHash certificates={MOCKED_CERTIFICATES} />
    </Card>
  ))
}

export default HistoryTab
