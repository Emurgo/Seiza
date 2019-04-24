// @flow
import React from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import WithModalState from '@/components/headless/modalState'
import {
  ExpandableCard,
  Divider,
  EllipsizeMiddle,
  ContentSpacing,
  AdaValue,
  Link,
} from '@/components/visual'
import {makeStyles} from '@material-ui/styles'
import {Typography, Grid} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'

const messages = defineMessages({
  addressCount: '{count, plural, =0 {# addresses} one {# address} other {# addresses}}',
  from: 'From:',
  to: 'To:',
  seeAll: 'See all addresses',
  hideAll: 'Hide all addresses',
})

const HeaderContent = ({caption, value}) => {
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

const useHeaderStyles = makeStyles((theme) => ({
  text: {
    textTransform: 'uppercase',
  },
}))

const Header = ({transaction}) => {
  const {translate: tr} = useI18n()
  const commonClasses = useCommonStyles()
  const classes = useHeaderStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={commonClasses.leftSide}>
        <ContentSpacing bottom={0.75} top={0.75}>
          <HeaderContent
            caption={
              <React.Fragment>
                <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                  {tr(messages.from)}
                </Typography>{' '}
                <Typography variant="caption" inline color="textPrimary">
                  {tr(messages.addressCount, {count: transaction.inputs.length})}
                </Typography>
              </React.Fragment>
            }
            value={<AdaValue value={transaction.totalInput} showCurrency showSign="-" />}
          />
        </ContentSpacing>
      </Grid>
      <Grid item xs={6}>
        <ContentSpacing bottom={0.75} top={0.75}>
          <HeaderContent
            caption={
              <React.Fragment>
                <Typography variant="caption" inline color="textSecondary" className={classes.text}>
                  {tr(messages.to)}
                </Typography>{' '}
                <Typography variant="caption" inline color="textPrimary">
                  {tr(messages.addressCount, {count: transaction.outputs.length})}
                </Typography>
              </React.Fragment>
            }
            value={<AdaValue value={transaction.totalOutput} showCurrency showSign="+" />}
          />
        </ContentSpacing>
      </Grid>
    </Grid>
  )
}

const BreakdownList = ({transaction}) => {
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

const useBreakdownItemStyles = makeStyles((theme) => ({
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
  monospace: theme.typography._monospace,
}))

const BreakdownItem = (props) => {
  const {valuePrefix, captionPrefix, target} = props
  const {address58, amount} = target
  const breakdownClasses = useBreakdownItemStyles()
  return (
    <ContentSpacing top={0} bottom={0}>
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
                  <div className={cn(breakdownClasses.underlineHover, breakdownClasses.monospace)}>
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
    </ContentSpacing>
  )
}

type Address58Amount = {
  address58: string,
  amount: string,
}

type RequiredTxProps = {
  totalInput: string,
  totalOutput: string,
  inputs: Array<Address58Amount>,
  outputs: Array<Address58Amount>,
}

type Props = {
  tx: RequiredTxProps,
}

const AddressesBreakdown = ({tx}: Props) => {
  const {translate: tr} = useI18n()
  return (
    <WithModalState>
      {({isOpen, toggle}) => (
        <ExpandableCard
          expanded={isOpen}
          onChange={toggle}
          renderHeader={() => <Header transaction={tx} />}
          renderExpandedArea={() => <BreakdownList transaction={tx} />}
          footer={isOpen ? tr(messages.hideAll) : tr(messages.seeAll)}
        />
      )}
    </WithModalState>
  )
}

export default AddressesBreakdown
