import React from 'react'
import {defineMessages, FormattedMessage} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {ExpandableCard, ExpandableCardFooter, ContentSpacing} from '@/components/visual'
import {Pagination, EntityCardContent, Link} from '@/components/common'
import useToggle from '@/components/hooks/useToggle'
import {useI18n} from '@/i18n/helpers'
import CertificateActionList from '@/screens/Blockchain/Certificates/ActionList'
import {routeTo} from '@/helpers/routes'
import CertificateActionsSummary from '@/screens/Blockchain/Certificates/ActionsSummary'
import TwoColumnRow from './TwoColumnRow'
import EmphasizedMessage from './EmphasizedMessage'

const useStyles = makeStyles((theme) => ({
  paginationWrapper: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
}))

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

const useTxStyles = makeStyles((theme) => ({
  bottomSpace: {
    marginBottom: theme.spacing(3),
  },
}))

const TruncatedCertificateList = ({txCount, txHash}) => {
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

const TransactionCard = ({tx}) => {
  const classes = useTxStyles()
  const [isOpen, toggle] = useToggle()
  const {translate: tr, formatInt, formatTimestamp} = useI18n()
  return (
    <div className={classes.bottomSpace}>
      <ExpandableCard
        expanded={isOpen}
        onChange={toggle}
        renderHeader={() => (
          <React.Fragment>
            <ContentSpacing>
              <EntityCardContent
                label={tr(transactionMessages.transactionEntity)}
                value={<Link to={routeTo.transaction(tx.txHash)}>{tx.txHash}</Link>}
                rawValue={tx.txHash}
              />
              <CertificateActionsSummary actions={tx.certificateActions} />
            </ContentSpacing>
            <TwoColumnRow
              label1={tr(transactionMessages.date)}
              value1={formatTimestamp(tx.date)}
              label2={tr(transactionMessages.epochSlot)}
              value2={
                <React.Fragment>
                  {formatInt(tx.epochNumber)} / {formatInt(tx.slot)}
                </React.Fragment>
              }
            />
          </React.Fragment>
        )}
        renderExpandedArea={() => (
          <React.Fragment>
            <CertificateActionList
              actions={tx.certificateActions.slice(0, MAX_SHOWN_CERTIFICATES)}
            />
            {tx.certificateActions.length > MAX_SHOWN_CERTIFICATES && (
              <TruncatedCertificateList txCount={MAX_SHOWN_CERTIFICATES} txHash={tx.txHash} />
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
  const classes = useStyles()
  return (
    <React.Fragment>
      {transactions && transactions.map((tx) => <TransactionCard key={tx.txHash} tx={tx} />)}
      {/* TODO: Pagination on right side */}
      <div className={classes.paginationWrapper}>
        <Pagination pageCount={1} page={1} onChangePage={() => null} />
      </div>
    </React.Fragment>
  )
}

export default TransactionsTab
