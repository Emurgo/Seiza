import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {
  ExpandableCard,
  ExpandableCardFooter,
  DesktopOnly,
  MobileOnly,
  SummaryCard,
  Divider,
} from '@/components/visual'
import {EntityCardContent, Link, DefaultEllipsizedEntity} from '@/components/common'
import useToggle from '@/components/hooks/useToggle'
import {useI18n} from '@/i18n/helpers'
import CertificateActionList from '@/screens/Blockchain/Certificates/ActionList'
import {routeTo} from '@/helpers/routes'
import CertificateActionsSummary from '@/screens/Blockchain/Certificates/ActionsSummary'
import TwoColumnRow from './TwoColumnRow'
import EmphasizedMessage from './EmphasizedMessage'

const {Row, Label, Value} = SummaryCard

const transactionMessages = defineMessages({
  transactionEntity: 'Transaction',
  epochSlot: 'Epoch / Slot:',
  date: 'Date:',
  showActionDetails: 'Show details of Actions',
  hideActionDetails: 'Hide details of Actions',
  truncatedCertificateList:
    'In this transaction more than {txCount} actions - see them on {txPage}',
  transactionPage: 'transaction page',
})

const useTxStyles = makeStyles(({spacing, getContentSpacing, breakpoints}) => ({
  bottomSpace: {
    marginBottom: spacing(3),
  },
  spacings: {
    paddingTop: spacing(1.25),
    paddingBottom: spacing(1.25),
    paddingLeft: getContentSpacing(0.5),
    paddingRight: getContentSpacing(0.5),
    [breakpoints.up('sm')]: {
      paddingTop: spacing(2.5),
      paddingBottom: spacing(2.5),
      paddingLeft: getContentSpacing(),
      paddingRight: getContentSpacing(),
    },
  },
}))

const TruncatedCertificateListMessage = ({txCount, txHash}) => {
  const {translate: tr, formatInt} = useI18n()
  return (
    <EmphasizedMessage>
      <FormattedMessage
        // $FlowFixMe
        id={transactionMessages.truncatedCertificateList.id}
        values={{
          txCount: formatInt(txCount),
          txPage: (
            <Link to={routeTo.transaction(txHash)}>{tr(transactionMessages.transactionPage)}</Link>
          ),
        }}
      />
    </EmphasizedMessage>
  )
}

const MAX_SHOWN_CERTIFICATES = 3

const TxCreationTimeSection = ({tx}) => {
  const {translate: tr, formatInt, formatTimestamp} = useI18n()
  const label1 = tr(transactionMessages.date)
  const label2 = tr(transactionMessages.epochSlot)

  const value1 = formatTimestamp(tx.date)
  const value2 = (
    <React.Fragment>
      {formatInt(tx.epochNumber)} / {formatInt(tx.slot)}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <DesktopOnly>
        <TwoColumnRow label1={label1} value1={value1} label2={label2} value2={value2} />
      </DesktopOnly>
      <MobileOnly>
        <Divider light />
        <Row>
          <Label>{label1}</Label>
          <Value>{value1}</Value>
        </Row>
        <Row>
          <Label>{label2}</Label>
          <Value>{value2}</Value>
        </Row>
      </MobileOnly>
    </React.Fragment>
  )
}

const TransactionCard = ({tx}) => {
  const classes = useTxStyles()
  const [isOpen, toggle] = useToggle()
  const {translate: tr} = useI18n()

  return (
    <div className={classes.bottomSpace}>
      <ExpandableCard
        expanded={isOpen}
        onChange={toggle}
        renderHeader={() => (
          <React.Fragment>
            <div className={classes.spacings}>
              <EntityCardContent
                label={tr(transactionMessages.transactionEntity)}
                value={
                  <Link to={routeTo.transaction(tx.txHash)}>
                    <DefaultEllipsizedEntity value={tx.txHash} />
                  </Link>
                }
                rawValue={tx.txHash}
                ellipsizeValue={false}
              />
              <CertificateActionsSummary actions={tx.certificateActions} />
            </div>
            <TxCreationTimeSection tx={tx} />
          </React.Fragment>
        )}
        renderExpandedArea={() => (
          <React.Fragment>
            <CertificateActionList
              actions={tx.certificateActions.slice(0, MAX_SHOWN_CERTIFICATES)}
            />
            {tx.certificateActions.length > MAX_SHOWN_CERTIFICATES && (
              <TruncatedCertificateListMessage
                txCount={MAX_SHOWN_CERTIFICATES}
                txHash={tx.txHash}
              />
            )}
          </React.Fragment>
        )}
        renderFooter={(expanded) => (
          <ExpandableCardFooter
            label={
              expanded
                ? tr(transactionMessages.hideActionDetails)
                : tr(transactionMessages.showActionDetails)
            }
            expanded={expanded}
          />
        )}
      />
    </div>
  )
}

const TransactionsTab = ({transactions}) => {
  return transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} tx={tx} />)
}

export default TransactionsTab
