// @flow
import React, {useRef} from 'react'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'
import {IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import idx from 'idx'

import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/components/context/googleAnalytics'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import {ObjectValues} from '@/helpers/flow'

import {useScrollFromBottom} from '@/components/hooks/useScrollFromBottom'
import useTabState from '@/components/hooks/useTabState'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import WithModalState from '@/components/headless/modalState'
import PagedTransactions from './PagedTransactions'
import QRDialog from './QRDialog'
import {SimpleLayout, LoadingDots, SummaryCard, Tooltip, EntityHeading} from '@/components/visual'
import {
  AdaValue,
  LoadingError,
  EntityIdCard,
  EntityCardContent,
  Pagination,
} from '@/components/common'

import qrCodeIcon from '@/static/assets/icons/qrcode.svg'

import {FILTER_TYPES} from './constants'
import {useLoadAddressTransactions, useLoadAddressSummary} from './dataLoaders'

const summaryMessages = defineMessages({
  NA: 'N/A',
  address: 'Address ID',
  transactionsCount: 'Total transactions for address',
  balance: 'Address Balance',
  totalAdaReceived: 'Total received ADA',
  totalAdaSent: 'Total sent ADA',
})

const Row = ({label, value}) => {
  const {translate} = useI18n()
  return (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{value}</SummaryCard.Value>
    </SummaryCard.Row>
  )
}

const AddressSummaryCard = ({addressSummary, loading}) => {
  const {translate, formatInt} = useI18n()

  const labels = summaryMessages

  const NA = loading ? <LoadingDots /> : translate(labels.NA)
  addressSummary = loading ? null : addressSummary

  const data = {
    txCount: formatInt(idx(addressSummary, (_) => _.transactionsCount), {defaultValue: NA}),
    balance: <AdaValue value={idx(addressSummary, (_) => _.balance)} noValue={NA} />,
    totalAdaReceived: (
      <AdaValue value={idx(addressSummary, (_) => _.totalAdaReceived)} noValue={NA} />
    ),
    totalAdaSent: <AdaValue value={idx(addressSummary, (_) => _.totalAdaSent)} noValue={NA} />,
  }

  return (
    <SummaryCard>
      <Row label={labels.transactionsCount} value={data.txCount} />
      <Row label={labels.balance} value={data.balance} />
      <Row label={labels.totalAdaReceived} value={data.totalAdaReceived} />
      <Row label={labels.totalAdaSent} value={data.totalAdaSent} />
    </SummaryCard>
  )
}

const messages = defineMessages({
  title: 'Address',
  showQRCode: 'Show QR code',
  transactionsHeading:
    '{count} {count, plural, =0 {Transactions} one {Transaction} other {Transactions}}',
  qrCodeDialogEntityLabel: 'Address Id',
})

const useStyles = makeStyles((theme) => ({
  headingWrapper: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
  },
  // 12px is width of hover part of button
  alignIconButton: {
    marginLeft: -12,
    marginRight: -12,
  },
}))

const usePaginations = () => {
  const [tabOnePage, onTabOnePageChange] = useManageQueryValue(FILTER_TYPES.ALL, 1, toIntOrNull)
  const [tabTwoPage, onTabTwoPageChange] = useManageQueryValue(FILTER_TYPES.SENT, 1, toIntOrNull)
  const [tabThreePage, onTabThreePageChange] = useManageQueryValue(
    FILTER_TYPES.RECEIVED,
    1,
    toIntOrNull
  )

  return {
    [FILTER_TYPES.ALL]: {page: tabOnePage, onChangePage: onTabOnePageChange},
    [FILTER_TYPES.SENT]: {page: tabTwoPage, onChangePage: onTabTwoPageChange},
    [FILTER_TYPES.RECEIVED]: {page: tabThreePage, onChangePage: onTabThreePageChange},
  }
}
const ROWS_PER_PAGE = 10

// Note: Math.max is used because user may change url to invalid number
const cursorFromPage = (page: number): number => Math.max((page - 1) * ROWS_PER_PAGE, 0)

const useTransactionsData = (address58, paginations) => {
  // We query all three different types for all/sent/received
  // so that use don't wait on spinner every time when he clicks between
  // all/sent/received tabs.

  const useTransactionsHelper = (filterType) =>
    useLoadAddressTransactions(
      address58,
      filterType,
      paginations[filterType].page != null ? cursorFromPage(paginations[filterType].page) : null
    )

  const all = useTransactionsHelper(FILTER_TYPES.ALL)
  const sent = useTransactionsHelper(FILTER_TYPES.SENT)
  const received = useTransactionsHelper(FILTER_TYPES.RECEIVED)

  return {
    [FILTER_TYPES.ALL]: all,
    [FILTER_TYPES.SENT]: sent,
    [FILTER_TYPES.RECEIVED]: received,
  }
}

const useManageTabs = (address58) => {
  const tabNames = ObjectValues(FILTER_TYPES)
  const [currentTab, setTab] = useManageQueryValue('tab', tabNames[0])
  const tabState = useTabState(tabNames, null, currentTab, setTab)
  const paginations = usePaginations()
  const transactionsData = useTransactionsData(address58, paginations)
  return {
    pagination: paginations[currentTab],
    transactionsData: transactionsData[currentTab],
    tabState,
    currentTab,
    setTab,
  }
}

const AddressScreen = () => {
  const {
    match: {
      params: {address58},
    },
  } = useReactRouter()
  const {pagination, transactionsData, tabState, currentTab, setTab} = useManageTabs(address58)

  const {loading, error, addressSummary} = useLoadAddressSummary(address58)

  const {page, onChangePage} = pagination
  const {
    loading: transactionsLoading,
    error: transactionsError,
    transactions: addressTransactions,
  } = transactionsData

  const transactions = idx(addressTransactions, (_) => _.transactions) || []

  const totalCount = idx(addressTransactions, (_) => _.totalCount) || 0

  const {translate: tr} = useI18n()
  const classes = useStyles()
  const scrollToRef = useRef(null)

  const analytics = useAnalytics()
  analytics.useTrackPageVisitEvent('address')

  useScrollFromBottom(scrollToRef, addressSummary)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout title={tr(messages.title)}>
        <EntityIdCard
          label={tr(summaryMessages.address)}
          value={address58}
          iconRenderer={
            <WithModalState>
              {({isOpen, openModal, closeModal}) => (
                <React.Fragment>
                  <Tooltip title={tr(messages.showQRCode)} enterTouchDelay={100}>
                    <IconButton
                      className={classes.alignIconButton}
                      onClick={openModal}
                      color="primary"
                    >
                      <img alt="show qr code" src={qrCodeIcon} />
                    </IconButton>
                  </Tooltip>
                  <QRDialog
                    qrCodeValue={address58}
                    description={
                      <EntityCardContent
                        label={tr(messages.qrCodeDialogEntityLabel)}
                        value={address58}
                      />
                    }
                    isOpen={isOpen}
                    onClose={closeModal}
                  />
                </React.Fragment>
              )}
            </WithModalState>
          }
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <AddressSummaryCard
              loading={!addressSummary && loading}
              addressSummary={addressSummary}
            />
            <div className={classes.headingWrapper}>
              <EntityHeading>
                {tr(messages.transactionsHeading, {
                  count: totalCount,
                })}
              </EntityHeading>
            </div>
            <PagedTransactions
              error={transactionsError}
              loading={transactionsLoading}
              targetAddress={address58}
              transactions={transactions}
              tabState={tabState}
              filterType={currentTab}
              changeFilterType={setTab}
              pagination={
                <Pagination
                  pageCount={getPageCount(totalCount, ROWS_PER_PAGE)}
                  page={page}
                  onChangePage={onChangePage}
                />
              }
            />
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default AddressScreen
