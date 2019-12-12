// @flow
import React, {useMemo} from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {
  Button,
  ExpandableCard,
  ExpandableCardFooter,
  Tooltip,
  DesktopOnly,
  MobileOnly,
} from '@/components/visual'
import {PoolEntityContent, NavTypography} from '@/components/common'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'

import {YoroiCallback} from '../../../helpers/iframeToYoroiMessaging'

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
  delegate: 'Delegate',
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
    // display: 'none',
    // [breakpoints.up('md')]: {
    //   display: 'initial',
    // },
  },
  profitabilityTypographyBlock: {
    display: 'flex',
    alignItems: 'center',
    marginRight: spacing(3),
  },
  profitabilityTypography: {
    fontSize: 24,
  },
  delegateButton: {
    paddingLeft: spacing(3),
    paddingRight: spacing(3),
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

const useDelegateBlockStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  block: {
    paddingBottom: spacing(4),
  },
}))

const ProfitabilityPosition = ({value}) => {
  const classes = useHeaderStyles()
  const {translate: tr} = useI18n()
  return (
    <Tooltip title={tr(messages.profitability)} placement="bottom">
      <div className="d-flex">
        <div className={classes.profitabilityTypographyBlock}>
          <Typography color="textSecondary" className={classes.profitabilityTypography}>
            #&nbsp;
          </Typography>
          <NavTypography className={classes.profitabilityTypography}>{value}</NavTypography>
        </div>
      </div>
    </Tooltip>
  )
}

const Header = ({name, hash, profitabilityPosition, showDelegateButton}) => {
  const classes = useHeaderStyles()
  const {translate: tr} = useI18n()
  const selectedPool = {
    name,
    poolHash: hash,
  }

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      className={classes.wrapper}
    >
      <Grid item xs={6} md={6} className={classes.flexEllipsize}>
        <PoolEntityContent name={name} hash={hash} />
      </Grid>
      <Grid item xs={6} md={6} className={classes.headerRewards}>
        <Grid container direction="row" justify="flex-end">
          <ProfitabilityPosition value={profitabilityPosition} />
          {showDelegateButton ? (
            <Button
              gradientDegree={225}
              onClick={YoroiCallback([selectedPool])}
              rounded
              variant="contained"
              gradient
              className={classes.delegateButton}
            >
              {tr(messages.delegate)}
            </Button>
          ) : (
            <div />
          )}
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
      <SimpleDataGrid leftItem={fields.estimatedRewards} rightItem={fields.feeAndMargin} />
      <MobileOnly className={classes.mobileRewards}>
        <Typography>{data.description}</Typography>
      </MobileOnly>
    </div>
  )
}

const PoolFooter = ({expanded}) => {
  const {translate: tr} = useI18n()

  const label = tr(expanded ? messages.hideDesc : messages.showDesc)
  return <ExpandableCardFooter {...{label, expanded}} />
}

const SimpleMobileStakepoolCard = React.memo(({isOpen, toggle, data, isYoroi}) => {
  const classes = useContentStyles()
  const classesH = useHeaderStyles()
  const classesD = useDelegateBlockStyles()
  const {translate: tr} = useI18n()
  const selectedPool = {
    name: data.name,
    poolHash: data.poolHash,
  }

  const renderExpandedArea = () => (
    <div className={classes.extraContent}>
      <Typography>{data.description}</Typography>
    </div>
  )

  const {description, ...dataNoDescription} = data
  const renderHeader = () => (
    <React.Fragment>
      <Header
        name={data.name}
        hash={data.hash}
        profitabilityPosition={data.profitabilityPosition}
        showDelegateButton={false}
      />
      <Content data={dataNoDescription} />
      {isYoroi ? (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classesD.block}
        >
          <Button
            onClick={YoroiCallback([selectedPool])}
            className={classesH.delegateButton}
            rounded
            gradient
            gradientDegree={225}
            variant="contained"
          >
            {tr(messages.delegate)}
          </Button>
        </Grid>
      ) : (
        <div />
      )}
    </React.Fragment>
  )

  const renderFooter = (expanded) => <PoolFooter expanded={expanded} />

  return (
    <ExpandableCard
      expanded={isOpen}
      onChange={toggle}
      renderHeader={renderHeader}
      renderExpandedArea={renderExpandedArea}
      renderFooter={renderFooter}
    />
  )
})

const SimpleDesktopStakepoolCard = ({isOpen, toggle, data, isYoroi}) => {
  const classes = useContentStyles()

  const renderExpandedArea = () => (
    <div className={classes.extraContent}>
      <Typography>{data.description}</Typography>
    </div>
  )

  const renderHeader = () => (
    <React.Fragment>
      <Header
        name={data.name}
        hash={data.hash}
        profitabilityPosition={data.profitabilityPosition}
        showDelegateButton={isYoroi}
      />
      <Content data={data} />
    </React.Fragment>
  )

  const renderFooter = (expanded) => <PoolFooter expanded={expanded} />

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
  isYoroi: boolean,
}

const SimpleStakepoolCard = ({data, isYoroi}: Props) => (
  <WithModalState>
    {({isOpen, toggle}) => {
      const props = {isOpen, toggle, data, isYoroi}
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
