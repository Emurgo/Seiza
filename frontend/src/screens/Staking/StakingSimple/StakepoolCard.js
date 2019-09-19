// @flow
import React, {useMemo} from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {
  ExpandableCard,
  ExpandableCardFooter,
  Tooltip,
  DesktopOnly,
  MobileOnly,
} from '@/components/visual'
import {PoolEntityContent, NavTypography} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'

import {
  SimpleDataGrid,
  getStakepoolCardFields,
  MobilePoolFooter,
  StakepoolMobileCard,
  useCommonContentStyles,
} from '../StakeList/stakepoolCardUtils'

const messages = defineMessages({
  hideDesc: 'Hide description',
  showDesc: 'Full description',
  addPool: 'Add',
  removePool: 'Remove',
  estimatedRewards: 'Rewards (Month):',
  ageLabel: 'Age:',
  ageValue: '{epochCount, plural, =0 {# epochs} one {# epoch} other {# epochs}}',
  estimatedRewardsTooltip:
    'To also show estimate in ADA, please enter your ADA amount into the field besides Search field',
  profitability: 'Profitability position',
})

const useHeaderStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  wrapper: {
    background: palette.background.paperContrast,
    padding: spacing(1),
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  flexEllipsize: {
    // needed for proper ellipsize in children components with flex
    minWidth: 0,
  },
  estimatedRewardsLabel: {
    textTransform: 'uppercase',
  },
  offsetPercentageRewards: {
    paddingLeft: spacing(1),
  },
  headerRewards: {
    display: 'none',
    [breakpoints.up('md')]: {
      display: 'initial',
    },
  },
  profitabilityValue: {
    fontSize: 24,
    paddingLeft: spacing(0.5),
  },
  profitabilityIcon: {
    fontSize: 24,
  },
}))

const useContentStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  extraContent: {
    padding: spacing(3),
  },
  mobileRewards: {
    paddingTop: spacing(2),
  },
}))

// TODO: change in next PR together with graphQl schema
const HARDCODED_PROFITABILITY = 9

const ProfitabilityPosition = ({value}) => {
  const classes = useHeaderStyles()
  const {translate: tr} = useI18n()
  return (
    <Tooltip title={tr(messages.profitability)} placement="bottom">
      <div className="d-flex">
        <Typography color="textSecondary" className={classes.profitabilityIcon}>
          #
        </Typography>
        <NavTypography className={classes.profitabilityValue}>{value}</NavTypography>
      </div>
    </Tooltip>
  )
}

const Header = ({name, hash}) => {
  const classes = useHeaderStyles()

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item xs={12} md={6} className={classes.flexEllipsize}>
        <PoolEntityContent name={name} hash={hash} />
      </Grid>
      <Grid item md={6} className={classes.headerRewards}>
        <Grid container direction="row" justify="flex-end">
          <ProfitabilityPosition value={HARDCODED_PROFITABILITY} />
        </Grid>
      </Grid>
    </Grid>
  )
}

const Content = ({data}) => {
  const formatters = useI18n()
  const classes = useContentStyles()
  const commonClasses = useCommonContentStyles()

  const fields = useMemo(() => getStakepoolCardFields({formatters, data}), [formatters, data])

  return (
    <div className={commonClasses.innerWrapper}>
      <SimpleDataGrid
        leftItem={fields.estimatedRewards}
        centerItem={fields.fee} // TODO: change in next PR
        rightItem={fields.fee} // TODO: change in next PR
      />
      <MobileOnly className={classes.mobileRewards}>
        <Typography>{data.description}</Typography>
      </MobileOnly>
    </div>
  )
}

const DesktopPoolFooter = ({expanded}) => {
  const {translate: tr} = useI18n()

  const label = tr(expanded ? messages.hideDesc : messages.showDesc)
  return <ExpandableCardFooter {...{label, expanded}} />
}

const SimpleMobileStakepoolCard = React.memo(({isOpen, toggle, data}) => {
  const renderExpandedArea = () => <Content data={data} />

  const renderHeader = (expanded) => (
    <Grid container direction="column">
      <MobilePoolFooter
        expanded={expanded}
        rightSide={<ProfitabilityPosition value={HARDCODED_PROFITABILITY} />}
      />
    </Grid>
  )

  return (
    <StakepoolMobileCard
      expanded={isOpen}
      onChange={toggle}
      nonExpandableHeader={<Header name={data.name} hash={data.hash} />}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
    />
  )
})

const SimpleDesktopStakepoolCard = ({isOpen, toggle, data}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <div className={classes.extraContent}>
      <Typography>{data.description}</Typography>
    </div>
  )

  const renderHeader = () => (
    <React.Fragment>
      <Header name={data.name} hash={data.hash} />
      <Content data={data} />
    </React.Fragment>
  )

  const renderFooter = (expanded) => <DesktopPoolFooter expanded={expanded} />

  return (
    <ExpandableCard
      expanded={isOpen}
      onChange={toggle}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
      renderFooter={renderFooter}
    />
  )
}

type Props = {
  data: Object, // TODO: type better
}

const SimpleStakepoolCard = ({data}: Props) => (
  <WithModalState>
    {({isOpen, toggle}) => {
      const props = {isOpen, toggle, data}
      return (
        <React.Fragment>
          <MobileOnly>
            <SimpleMobileStakepoolCard {...props} />
          </MobileOnly>
          <DesktopOnly>
            <SimpleDesktopStakepoolCard {...props} />
          </DesktopOnly>
        </React.Fragment>
      )
    }}
  </WithModalState>
)

export default SimpleStakepoolCard
