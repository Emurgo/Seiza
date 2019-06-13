// @flow
import React, {useCallback} from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import idx from 'idx'
import {makeStyles} from '@material-ui/styles'
import {Typography, Grid, Hidden} from '@material-ui/core'

import {
  ExpandableCardContent,
  Divider,
  EllipsizeMiddle,
  ContentSpacing,
  AdaValue,
  Link,
  Card,
} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {useIsMobile} from '@/hooks/useBreakpoints'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CopyToClipboard from '@/components/common/CopyToClipboard'

import type {Transaction} from '@/__generated__/schema.flow'

const messages = defineMessages({
  addressCount: '{count, plural, =0 {# addresses} one {# address} other {# addresses}}',
  from: 'From:',
  to: 'To:',
  fromSeparator: 'From:',
  toSeparator: 'To:',
  seeAll: 'See all addresses',
  hideAll: 'Hide all addresses',
})

const useCommonStyles = makeStyles((theme) => ({
  leftSide: {
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.contentUnfocus}`,
    },
  },
  headerContent: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
}))

const HeaderContent = ({caption, value}) => {
  const commonClasses = useCommonStyles()
  return (
    <Grid container className={commonClasses.headerContent}>
      <Grid item>{caption}</Grid>
      <Grid item>{value}</Grid>
    </Grid>
  )
}

const Header = ({transaction}) => {
  const {translate: tr} = useI18n()
  const commonClasses = useCommonStyles()

  const timestamp = idx(transaction, (_) => _.block.timeIssued)

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={6} className={commonClasses.leftSide}>
        <ContentSpacing bottom={0.75} top={0.75}>
          <HeaderContent
            caption={
              <React.Fragment>
                <Typography variant="body1" inline color="textSecondary">
                  {tr(messages.from)}
                </Typography>{' '}
                <Typography variant="body1" inline color="textPrimary">
                  {tr(messages.addressCount, {count: transaction.inputs.length})}
                </Typography>
              </React.Fragment>
            }
            value={
              <AdaValue
                value={transaction.totalInput}
                showCurrency
                showSign="-"
                timestamp={timestamp}
              />
            }
          />
        </ContentSpacing>
      </Grid>
      <Grid item xs={12} md={6}>
        <ContentSpacing bottom={0.75} top={0.75}>
          <HeaderContent
            caption={
              <React.Fragment>
                <Typography variant="body1" inline color="textSecondary">
                  {tr(messages.to)}
                </Typography>{' '}
                <Typography variant="body1" inline color="textPrimary">
                  {tr(messages.addressCount, {count: transaction.outputs.length})}
                </Typography>
              </React.Fragment>
            }
            value={
              <AdaValue
                value={transaction.totalOutput}
                showCurrency
                showSign="+"
                timestamp={timestamp}
              />
            }
          />
        </ContentSpacing>
      </Grid>
    </Grid>
  )
}

// Note: not sure whether reuse separator styles from Table, for now copying them
// as they might be styled differently soon
const useSeparatorStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
  },
  separatorLine: {
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
    flexGrow: 1,
    margin: '10px 10px 10px 10px',
  },
}))

const AddressSeparator = ({text}) => {
  const classes = useSeparatorStyles()
  return (
    <div className={classes.container}>
      <div className={classes.separatorLine} />
      <Typography variant="body1" inline color="textSecondary">
        {text}
      </Typography>
      <div className={classes.separatorLine} />
    </div>
  )
}

const BreakdownList = ({transaction, targetAddress}) => {
  const {translate: tr} = useI18n()
  const isMobile = useIsMobile()
  const commonClasses = useCommonStyles()

  const hasTargetAddress = useCallback(
    (inputOrOutput) => targetAddress && inputOrOutput.address58 === targetAddress,
    [targetAddress]
  )
  const timestamp = idx(transaction, (_) => _.block.timeIssued)
  const getShowDivider = useCallback((index) => !isMobile || index !== 0, [isMobile])

  return (
    <Grid container direction="row">
      <Hidden mdUp implementation="css" className="w-100">
        <AddressSeparator text={tr(messages.fromSeparator)} />
      </Hidden>
      <Grid item xs={12} md={6} className={commonClasses.leftSide}>
        {transaction.inputs.map((input, index, items) => (
          <BreakdownItem
            showDivider={getShowDivider(index)}
            hasHighlight={hasTargetAddress(input)}
            isLink={!hasTargetAddress(input)}
            key={index}
            target={input}
            valuePrefix={'-'}
            timestamp={timestamp}
          />
        ))}
      </Grid>
      <Hidden mdUp implementation="css" className="w-100">
        <AddressSeparator text={tr(messages.toSeparator)} />
      </Hidden>
      <Grid item xs={12} md={6}>
        {transaction.outputs.map((output, index, items) => (
          <BreakdownItem
            showDivider={getShowDivider(index)}
            hasHighlight={hasTargetAddress(output)}
            isLink={!hasTargetAddress(output)}
            key={index}
            target={output}
            valuePrefix={'+'}
            timestamp={timestamp}
          />
        ))}
      </Grid>
    </Grid>
  )
}

const useAddressHashStyles = makeStyles((theme) => ({
  spaced: {
    width: '95%',
  },
  typographyWrapper: {
    fontWeight: ({hasHighlight}) => (hasHighlight ? 700 : 'initial'),
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
  monospace: theme.typography._monospace,
}))

const AddressHash = ({address58, isLink, hasHighlight}) => {
  const breakdownClasses = useAddressHashStyles({hasHighlight})

  const ellipsizedAddress58 = <EllipsizeMiddle value={address58} />
  const content = isLink ? (
    <Link to={routeTo.address(address58)} underline="none">
      <div className={cn(breakdownClasses.underlineHover, breakdownClasses.monospace)}>
        {ellipsizedAddress58}
      </div>
    </Link>
  ) : (
    <div className={breakdownClasses.monospace}>{ellipsizedAddress58}</div>
  )

  return (
    <div className={breakdownClasses.spaced}>
      <Typography
        variant="body1"
        color="textPrimary"
        component="div"
        className={breakdownClasses.typographyWrapper}
      >
        {content}
      </Typography>
    </div>
  )
}

const useBreakdownItemStyles = makeStyles((theme) => ({
  rowSpacing: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 1.5,
  },
  copy: {
    marginLeft: theme.spacing.unit,
  },
}))

const IMG_DIMENSIONS = {width: 20, height: 20}

const BreakdownItem = (props) => {
  const {valuePrefix, target, hasHighlight, isLink, timestamp, showDivider} = props
  const {address58, amount} = target
  const breakdownClasses = useBreakdownItemStyles()

  return (
    <ContentSpacing top={0} bottom={0}>
      {showDivider && <Divider light />}
      <Grid
        container
        justify="space-between"
        alignItems="center"
        direction="row"
        className={breakdownClasses.rowSpacing}
      >
        <Grid item xs={12} sm={6}>
          <Grid container direction="row" alignItems="center" wrap="nowrap">
            <AddressHash {...{hasHighlight, isLink, address58}} />

            <div className={breakdownClasses.copy}>
              <CopyToClipboard value={address58} imgDimensions={IMG_DIMENSIONS} outlineSize={4} />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container justify="flex-end" direction="row">
            <AdaValue value={amount} showSign={valuePrefix} showCurrency timestamp={timestamp} />
          </Grid>
        </Grid>
      </Grid>
    </ContentSpacing>
  )
}

type Props = {
  tx: Transaction,
  targetAddress?: string,
}

export const AddressesBreakdownContent = ({tx, targetAddress}: Props) => {
  const {translate: tr} = useI18n()
  return (
    <WithModalState>
      {({isOpen, toggle}) => (
        <ExpandableCardContent
          expanded={isOpen}
          onChange={toggle}
          renderHeader={() => <Header transaction={tx} />}
          renderExpandedArea={() => (
            <BreakdownList transaction={tx} targetAddress={targetAddress} />
          )}
          footer={isOpen ? tr(messages.hideAll) : tr(messages.seeAll)}
        />
      )}
    </WithModalState>
  )
}

const AddressesBreakdown = (props: Props) => (
  <Card>
    <AddressesBreakdownContent {...props} />
  </Card>
)

export default AddressesBreakdown
