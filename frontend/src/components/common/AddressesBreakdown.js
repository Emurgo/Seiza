// @flow
import React from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import WithModalState from '@/components/headless/modalState'
import {
  ExpandableCardContent,
  Divider,
  EllipsizeMiddle,
  ContentSpacing,
  AdaValue,
  Link,
  Card,
} from '@/components/visual'
import {makeStyles} from '@material-ui/styles'
import {Typography, Grid} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import CopyToClipboard from '@/components/common/CopyToClipboard'

import type {Transaction} from '@/__generated__/schema.flow'

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
      <Grid item>{caption}</Grid>
      <Grid item>{value}</Grid>
    </Grid>
  )
}

const useCommonStyles = makeStyles((theme) => ({
  leftSide: {
    borderRight: `1px solid ${theme.palette.contentUnfocus}`,
  },
}))

const Header = ({transaction}) => {
  const {translate: tr} = useI18n()
  const commonClasses = useCommonStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={commonClasses.leftSide}>
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
            value={<AdaValue value={transaction.totalInput} showCurrency showSign="-" />}
          />
        </ContentSpacing>
      </Grid>
      <Grid item xs={6}>
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
            value={<AdaValue value={transaction.totalOutput} showCurrency showSign="+" />}
          />
        </ContentSpacing>
      </Grid>
    </Grid>
  )
}

const BreakdownList = ({transaction}) => {
  const commonClasses = useCommonStyles()
  return (
    <Grid container direction="row">
      <Grid item xs={6} className={commonClasses.leftSide}>
        {transaction.inputs.map((input, index, items) => (
          <BreakdownItem key={index} target={input} valuePrefix={'-'} />
        ))}
      </Grid>
      <Grid item xs={6}>
        {transaction.outputs.map((output, index, items) => (
          <BreakdownItem key={index} target={output} valuePrefix={'+'} />
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
  copy: {
    marginLeft: theme.spacing.unit,
  },
}))

const IMG_DIMENSIONS = {width: 15, height: 15}

const BreakdownItem = (props) => {
  const {valuePrefix, target} = props
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
          <Typography variant="body1" color="textSecondary">
            <Grid container direction="row" alignItems="center" wrap="nowrap">
              <div className={breakdownClasses.spaced}>
                <Link to={routeTo.address(address58)} underline="none">
                  <div className={cn(breakdownClasses.underlineHover, breakdownClasses.monospace)}>
                    <EllipsizeMiddle value={address58} />
                  </div>
                </Link>
              </div>
              <div className={breakdownClasses.copy}>
                <CopyToClipboard value={address58} imgDimensions={IMG_DIMENSIONS} outlineSize={4} />
              </div>
            </Grid>
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

type Props = {
  tx: Transaction,
}

export const AddressesBreakdownContent = ({tx}: Props) => {
  const {translate: tr} = useI18n()
  return (
    <WithModalState>
      {({isOpen, toggle}) => (
        <ExpandableCardContent
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

const AddressesBreakdown = (props: Props) => (
  <Card>
    <AddressesBreakdownContent {...props} />
  </Card>
)

export default AddressesBreakdown
