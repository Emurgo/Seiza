// @flow
import React, {useRef, useEffect} from 'react'
import {useQuery} from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import {defineMessages} from 'react-intl'
import classnames from 'classnames'
import idx from 'idx'
import gql from 'graphql-tag'
import {makeStyles} from '@material-ui/styles'
import {Typography, Grid} from '@material-ui/core'

import {
  SummaryCard,
  SimpleLayout,
  LoadingInProgress,
  LoadingError,
  EntityIdCard,
  ExpandableCard,
  AdaValue,
  Link,
  Divider,
  EllipsizeMiddle,
  Overlay,
  LoadingOverlay,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import AssuranceChip from '@/components/common/AssuranceChip'
import AdaIcon from '@/assets/icons/transaction-id.svg'

import {ASSURANCE_LEVELS_VALUES} from '@/config'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

const messages = defineMessages({
  header: 'Transaction',
  transactionId: 'Transaction Id',
  assuranceLevel: 'Assurance Level:',
  confirmations:
    '{count, plural, =0 {# confirmations} one {# confirmation} other {# confirmations}}',
  epoch: 'Epoch:',
  slot: 'Slot:',
  date: 'Date:',
  size: 'Size:',
  fees: 'Transaction Fees:',
  notAvailable: 'N/A',
  addressCount: '#{count, plural, =0 {# addresses} one {# address} other {# addresses}}',
  from: 'From:',
  to: 'To:',
  seeAll: 'See all addresses',
  hideAll: 'Hide all addresses',
})

type AssuranceEnum = 'LOW' | 'MEDIUM' | 'HIGH'
const assuranceFromConfirmations = (cnt: number): AssuranceEnum => {
  if (cnt <= ASSURANCE_LEVELS_VALUES.LOW) {
    return 'LOW'
  } else if (cnt <= ASSURANCE_LEVELS_VALUES.MEDIUM) {
    return 'MEDIUM'
  } else {
    return 'HIGH'
  }
}

const Summary = ({caption, value}) => {
  return (
    <Grid container justify="space-between" alignItems="center" direction="row">
      <Grid item>
        <Typography variant="caption">{caption}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </Grid>
  )
}

const useCommonStyles = makeStyles((theme) => ({
  leftSide: {
    borderRight: `1px solid ${theme.palette.contentUnfocus}`,
  },
}))

const useAddressSummaryStyles = makeStyles((theme) => ({
  text: {
    textTransform: 'uppercase',
  },
  padding: {
    padding: theme.spacing.unit * 4,
  },
}))

const AddressesSummary = ({transaction}) => {
  const {translate} = useI18n()
  const commonClasses = useCommonStyles()
  const classes = useAddressSummaryStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={classnames(commonClasses.leftSide, classes.padding)}>
        <Summary
          caption={
            <React.Fragment>
              <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                {translate(messages.from)}
              </Typography>{' '}
              <Typography variant="caption" inline color="textPrimary">
                {translate(messages.addressCount, {count: transaction.inputs.length})}
              </Typography>
            </React.Fragment>
          }
          value={<AdaValue value={transaction.totalInput} showCurrency showSign="-" />}
        />
      </Grid>
      <Grid item xs={6} className={classes.padding}>
        <Summary
          caption={
            <React.Fragment>
              <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                {translate(messages.to)}
              </Typography>{' '}
              <Typography variant="caption" inline color="textPrimary">
                {translate(messages.addressCount, {count: transaction.outputs.length})}
              </Typography>
            </React.Fragment>
          }
          value={<AdaValue value={transaction.totalOutput} showCurrency showSign="+" />}
        />
      </Grid>
    </Grid>
  )
}

const useBreakdownStyles = makeStyles((theme) => ({
  margin: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
  },
  rowSpacing: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 1.5,
  },
  spaced: {
    width: '95%',
  },
  underlineHover: {
    // hidden border so that text does not jump on hover
    'borderBottom': '1px solid transparent',
    '&:hover': {
      borderBottom: '1px solid',
    },
    // border at the same position as underline
    '& > :first-child': {
      marginBottom: -4,
    },
  },
}))

const BreakdownItem = (props) => {
  const {valuePrefix, captionPrefix, target} = props
  const {address58, amount} = target
  const breakdownClasses = useBreakdownStyles()
  return (
    <div className={breakdownClasses.margin}>
      <Divider light />
      <Grid
        container
        justify="space-between"
        alignItems="center"
        direction="row"
        className={breakdownClasses.rowSpacing}
      >
        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary">
            <div className="d-flex">
              {captionPrefix}
              <div className={breakdownClasses.spaced}>
                <Link to={routeTo.address(address58)} underline="none">
                  <div className={breakdownClasses.underlineHover}>
                    <EllipsizeMiddle value={address58} />
                  </div>
                </Link>
              </div>
            </div>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end" direction="row">
            <AdaValue value={amount} showSign={valuePrefix} showCurrency />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const AddressesBreakdown = ({transaction}) => {
  const {formatInt} = useI18n()
  const commonClasses = useCommonStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={commonClasses.leftSide}>
        {transaction.inputs.map((input, index, items) => (
          <BreakdownItem
            key={index}
            target={input}
            captionPrefix={<React.Fragment>#&nbsp;{formatInt(index + 1)}&nbsp;</React.Fragment>}
            valuePrefix={'-'}
          />
        ))}
      </Grid>
      <Grid item xs={6}>
        {transaction.outputs.map((output, index, items) => (
          <BreakdownItem
            key={index}
            target={output}
            captionPrefix={<React.Fragment>#&nbsp;{formatInt(index + 1)}&nbsp;</React.Fragment>}
            valuePrefix={'+'}
          />
        ))}
      </Grid>
    </Grid>
  )
}

const TransactionSummary = ({loading, transaction}) => {
  const {translate, formatInt, formatTimestamp} = useI18n()

  const NA = translate(messages.notAvailable)

  const Item = ({label, children}) => (
    <SummaryCard.Row>
      <SummaryCard.Label>{translate(label)}</SummaryCard.Label>
      <SummaryCard.Value>{children}</SummaryCard.Value>
    </SummaryCard.Row>
  )

  const epochNumber = idx(transaction, (_) => _.block.epoch)
  const slot = idx(transaction, (_) => _.block.slot)
  const blockHash = idx(transaction, (_) => _.block.blockHash)

  const data = {
    assuranceBadge:
      idx(transaction, (_) => _.confirmationsCount) != null ? (
        // $FlowFixMe flow does not understand idx precondition
        <AssuranceChip level={assuranceFromConfirmations(transaction.confirmationsCount)} />
      ) : null,
    confirmations: translate(messages.confirmations, {
      count: formatInt(idx(transaction, (_) => _.confirmationsCount), {defaultValue: NA}),
    }),
    epoch:
      epochNumber != null ? (
        <Link to={routeTo.epoch(epochNumber)}>{formatInt(epochNumber)}</Link>
      ) : (
        NA
      ),
    slot: blockHash != null ? <Link to={routeTo.block(blockHash)}>{formatInt(slot)}</Link> : NA,
    date: formatTimestamp(idx(transaction, (_) => _.block.timeIssued), {
      defaultValue: NA,
      format: formatTimestamp.FMT_MONTH_NUMERAL,
    }),
    size: formatInt(idx(transaction, (_) => _.size), {defaultValue: NA}),
    fees: <AdaValue value={idx(transaction, (_) => _.fees)} noValue={NA} showCurrency />,
  }

  return (
    <Overlay.Wrapper>
      <SummaryCard>
        <Item label={messages.assuranceLevel}>
          <span>
            {data.assuranceBadge} {data.confirmations}
          </span>
        </Item>
        <Item label={messages.epoch}>{data.epoch}</Item>
        <Item label={messages.slot}>{data.slot}</Item>
        <Item label={messages.date}>{data.date}</Item>
        <Item label={messages.size}>{data.size}</Item>
        <Item label={messages.fees}>{data.fees}</Item>
      </SummaryCard>
      <LoadingOverlay loading={loading} />
    </Overlay.Wrapper>
  )
}

const useTransactionData = (txHash) => {
  const {loading, error, data} = useQuery(
    gql`
      query($txHash: String!) {
        transaction(txHash: $txHash) {
          txHash
          block {
            timeIssued
            blockHeight
            epoch
            slot
            blockHash
          }
          totalInput
          totalOutput
          fees
          inputs {
            address58
            amount
          }
          outputs {
            address58
            amount
          }
          confirmationsCount
          size
        }
      }
    `,
    {
      variables: {txHash},
    }
  )
  return {loading, error, transactionData: data.transaction}
}

const useScreenParams = () => {
  const {
    match: {
      params: {txHash},
    },
  } = useReactRouter()
  return {txHash}
}

const TransactionScreen = () => {
  const {txHash} = useScreenParams()
  const {loading, transactionData, error} = useTransactionData(txHash)
  const {translate} = useI18n()
  const inputEl = useRef(null)

  useEffect(() => {
    const offsetTop = idx(inputEl, (_) => _.current.offsetTop)

    window.scrollTo({left: 0, top: offsetTop})
  }, [transactionData])

  return (
    <div ref={inputEl}>
      <SimpleLayout title={translate(messages.header)}>
        <EntityIdCard
          label={translate(messages.transactionId)}
          value={txHash}
          iconRenderer={<img alt="" src={AdaIcon} width={40} height={40} />}
        />
        {error ? (
          <LoadingError error={error} />
        ) : (
          <React.Fragment>
            <TransactionSummary loading={loading} transaction={transactionData} />
            {loading ? (
              <LoadingInProgress />
            ) : (
              <WithModalState>
                {({isOpen, toggle}) => (
                  <ExpandableCard
                    expanded={isOpen}
                    onChange={toggle}
                    renderHeader={() => <AddressesSummary transaction={transactionData} />}
                    renderExpandedArea={() => <AddressesBreakdown transaction={transactionData} />}
                    footer={isOpen ? translate(messages.hideAll) : translate(messages.seeAll)}
                  />
                )}
              </WithModalState>
            )}
          </React.Fragment>
        )}
      </SimpleLayout>
    </div>
  )
}

export default TransactionScreen
