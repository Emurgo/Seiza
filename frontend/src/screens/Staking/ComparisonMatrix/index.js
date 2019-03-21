// @flow

import * as React from 'react'
import _ from 'lodash'
import gql from 'graphql-tag'
import classnames from 'classnames'
import {useQuery} from 'react-apollo-hooks'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'

import {Grid, Typography, Tooltip, createStyles} from '@material-ui/core'
import {useI18n} from '@/i18n/helpers'
import {useSelectedPoolsContext} from '../context/selectedPools'
import {LoadingInProgress} from '@/components/visual'
import CopyToClipboard from '@/components/common/CopyToClipboard'

// TODO: Markdown/css polish
// TODO?: full width scenario
// TODO (postpone): colors based on "goodness" for comparable rows

// eslint-disable-next-line
const generateLongText = (string, repeats) =>
  _.range(0, repeats)
    .map(() => string)
    .join('')

// "turn on" for proper overflow testing
const DEMO_OVERFLOW_TEXT = '' // generateLongText('M', 40)
const DEMO_OVERFLOW_TEXT2 = '' // generateLongText(' Hello', 40)

const messages = defineMessages({
  stakePools: `Stake pools ${DEMO_OVERFLOW_TEXT}`,
  categoryOneLabel: 'Category 1',
  categoryTwoLabel: 'Category 2',
  categoryThreeLabel: 'Category 3',
  noData: 'There are no pools selected.',
  copyText: 'Copy',
})

const ellipsizeStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const CATEGORIES_PANEL_WIDTH = 200
const VALUES_PANEL_WIDTH = 300

const useStyles = makeStyles((theme) => {
  const darkBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.2)}`
  const lightBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.05)}`
  const padding = theme.spacing.unit * 2
  const categoriesPanelWidth = `${CATEGORIES_PANEL_WIDTH}px`
  const valuesPanelWidth = `${VALUES_PANEL_WIDTH}px`
  return createStyles({
    ellipsis: ellipsizeStyles,
    wrapper: {
      margin: theme.spacing.unit * 6,
      display: 'flex',
    },
    categoriesWrapper: {
      'background': theme.palette.background.paper,
      'width': categoriesPanelWidth,
      '& > *': {
        borderRight: darkBorder,
        borderBottom: darkBorder,
      },
      '& > :first-child': {
        borderBottom: 'none',
      },
      '& > :last-child': {
        borderBottom: 'none',
      },
    },
    category: {
      'borderBottom': darkBorder,
      '&:last-child': {
        borderBottom: 'none',
      },
      '& > *': {
        borderBottom: lightBorder,
      },
      '& > :last-child': {
        borderBottom: 'none',
      },
    },
    categoryKey: {
      width: categoriesPanelWidth,
      padding,
      ...ellipsizeStyles,
    },
    scrollWrapper: {
      'background': theme.palette.background.paper,
      'overflowX': 'auto',
      'borderRadius': '0 5px 0 0',

      '&::-webkit-scrollbar': {
        height: '6px',
        background: 'red',
        position: 'absolute',
        top: '-30px',
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
        'background': darken(theme.palette.background.default, 0.1),
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.5)',
        outline: '1px solid slategrey',
        borderRadius: '5px',
      },
    },
    rowsWrapper: {
      '& > *': {
        borderBottom: darkBorder,
      },
      '& > :last-child': {
        borderBottom: 'none',
      },
    },
    data: {
      '& > *': {
        borderBottom: lightBorder,
      },
      '& > :last-child': {
        borderBottom: 'none',
      },
    },
    dataText: {
      width: valuesPanelWidth,
      padding,
    },
    header: {
      background: darken(theme.palette.background.default, 0.1),
      padding: theme.spacing.unit * 2.5,
      height: '60px', // Note: otherwise there is +1 pixel strange issue
    },
    dot: {
      height: 20,
      width: 20,
      borderRadius: 10,
      background: theme.palette.background.paper,
      marginRight: theme.spacing.unit,
    },
    poolHeader: {
      width: valuesPanelWidth,
      ...ellipsizeStyles,
    },
    categoryHeader: {
      borderRadius: '5px 0 0 0',
      width: categoriesPanelWidth,
      ...ellipsizeStyles,
    },
    categoryRowWrapper: {
      '& > *': {
        borderLeft: darkBorder,
      },
      '& > :first-child': {
        borderLeft: 'none',
      },
    },
    categoryGap: {
      height: 40,
      borderBottom: 'none',
    },
    categogyTitle: {
      'height': 40,
      'display': 'flex',
      'alignItems': 'center',
      'borderBottom': 'none',
      padding,
      '& span': {
        fontWeight: 600,
      },
    },
    noPools: {
      padding,
    },
  })
})

const useTooltipStyles = makeStyles((theme) => {
  return {
    text: {
      wordBreak: 'break-word',
      color: 'white',
    },
    copy: {
      cursor: 'pointer',
      padding: '10px 0',
      display: 'flex',
      justifyContent: 'center',
    },
  }
})

const CustomTooltip = ({text}) => {
  const {translate} = useI18n()
  const classes = useTooltipStyles()
  return (
    <div>
      <Typography className={classes.text}>{text}</Typography>
      <div className={classes.copy}>
        <CopyToClipboard value={text}>{translate(messages.copyText)}</CopyToClipboard>
      </div>
    </div>
  )
}

type CategoryConfigType = Array<{|
  label: string,
  getValue?: (Object, Object) => any,
  render?: (Object, Object) => any,
  height?: number,
|}>

const categoryOneConfig = [
  {
    label: 'Performance',
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.performance),
  },
  {
    label: 'Pledge',
    getValue: (stakePool, {formatAda}) => formatAda(stakePool.summary.pledge),
  },
  {
    label: `Margins ${DEMO_OVERFLOW_TEXT}`,
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.margins),
  },
  {
    label: 'Creation time',
    getValue: (stakePool, {formatTimestamp}) => formatTimestamp(stakePool.createdAt),
  },
  {
    label: 'Last updated',
    getValue: (stakePool, formatters) => 'N/A',
  },
]

const categoryTwoConfig = [
  {
    label: 'Fullness',
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.fullness),
  },
  {
    label: 'Cost',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'Ranking',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'Revenue',
    getValue: (stakePool, {formatPercent}) => formatPercent(stakePool.summary.revenue),
  },
  {
    label: 'Last updated',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'ADA to Slot',
    getValue: (stakePool, formatters) => 'N/A',
  },
]

const useDescriptionStyles = makeStyles((theme) => {
  return {
    wrapper: {
      position: 'relative',
    },
    overlay: {
      height: '90px',
      width: '100%',
      background: `linear-gradient(to top, ${theme.palette.background.paper} 0%, ${fade(
        theme.palette.background.paper,
        0.15
      )} 70%)`,
      position: 'absolute',
      bottom: 0,
    },
    text: {
      height: 95,
      overflow: 'hidden',
    },
  }
})

const StakePoolDescription = ({text}) => {
  const classes = useDescriptionStyles()
  return (
    <Tooltip title={<CustomTooltip text={text} />} placement="top" interactive>
      <div className={classes.wrapper}>
        <Typography className={classes.text} variant="body1">
          {text}
        </Typography>
        <div className={classes.overlay} />
      </div>
    </Tooltip>
  )
}

const categoryThreeConfig = [
  {
    label: 'Region',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'Lifetime Review',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'K-position',
    getValue: (stakePool, formatters) => 'N/A',
  },
  {
    label: 'Description',
    render: (stakePool, formatters) => {
      return <StakePoolDescription text={stakePool.description + DEMO_OVERFLOW_TEXT2} />
    },
    height: 132, // used to sync height with label field
  },
]

const PoolDataFragment = gql`
  fragment ComparisonMatrixDataFragment on BootstrapEraStakePool {
    poolHash
    name
    createdAt
    description
    summary {
      revenue
      performance
      adaStaked
      rewards
      keysDelegating
      fullness
      margins
      pledge
    }
  }
`

type CategoryKeysProps = {|
  categoryConfig: CategoryConfigType,
  categoryLabel: string,
|}

const CategoryKeys = ({categoryConfig, categoryLabel}: CategoryKeysProps) => {
  const classes = useStyles()
  return (
    <Grid className={classes.category} container direction="column">
      <div className={classes.categogyTitle}>
        <Typography variant="caption">{categoryLabel}</Typography>
      </div>
      {categoryConfig.map(({label, height}) => (
        <Typography
          key={label}
          style={height ? {height} : {}}
          className={classes.categoryKey}
          variant="body1"
        >
          {label}
        </Typography>
      ))}
    </Grid>
  )
}

type CategoryDataProps = {|
  data: Object, // get graphql type
  categoryConfig: CategoryConfigType,
|}

const CategoryData = ({data, categoryConfig}: CategoryDataProps) => {
  const classes = useStyles()
  const intlFormatters = useI18n()
  return (
    <Grid className={classes.data} container direction="column" wrap="nowrap">
      <div className={classes.categoryGap} />
      {categoryConfig.map(({label, getValue, render, height}) => (
        <React.Fragment key={label}>
          {render ? (
            <div className={classes.dataText}>{render(data, intlFormatters)}</div>
          ) : getValue ? (
            <Typography
              style={height ? {height} : {}}
              className={classnames(classes.dataText, classes.ellipsis)}
              variant="body1"
            >
              {getValue(data, intlFormatters)}
            </Typography>
          ) : null}
        </React.Fragment>
      ))}
    </Grid>
  )
}

type StakePoolHeaderProps = {|
  title: string,
|}

const StakePoolHeader = ({title}: StakePoolHeaderProps) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="row"
      className={classnames(classes.header, classes.poolHeader)}
      wrap="nowrap"
    >
      {/* Note: not working properly when text overflows if not wrapped this way */}
      <Grid item>
        <div className={classes.dot} />
      </Grid>
      <Typography className={classes.ellipsis} variant="overline">
        {title} {DEMO_OVERFLOW_TEXT}
      </Typography>
    </Grid>
  )
}

type CategoryHeaderProps = {|
  title: string,
|}

const CategoryHeader = ({title}: CategoryHeaderProps) => {
  const classes = useStyles()
  return (
    <Typography className={classnames(classes.header, classes.categoryHeader)} variant="overline">
      {title}
    </Typography>
  )
}

type CategoryDataRowProps = {|
  data: Array<Object>, // TODO: get graphql type
  categoryConfig: CategoryConfigType,
  showHeader?: boolean,
|}

const CategoryDataRow = ({data, showHeader, categoryConfig}: CategoryDataRowProps) => {
  const classes = useStyles()
  return (
    <Grid container direction="row" wrap="nowrap" className={classes.categoryRowWrapper}>
      {data.map((stakePool) => (
        <Grid item key={stakePool.poolHash}>
          <Grid container direction="column">
            {showHeader && (
              <Grid item>
                <StakePoolHeader title={stakePool.name} />
              </Grid>
            )}
            <Grid item>
              <CategoryData data={stakePool} categoryConfig={categoryConfig} />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

const ComparisonMatrix = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {selectedPools: poolHashes} = useSelectedPoolsContext()

  const {error, loading, data} = useQuery(
    gql`
      query($poolHashes: [String!]!) {
        stakePools(poolHashes: $poolHashes) {
          ...ComparisonMatrixDataFragment
        }
      }
      ${PoolDataFragment}
    `,
    {
      variables: {poolHashes},
    }
  )

  if (loading && !data.stakePools) {
    // Note: this can hardly be cented right using FullWidth layout
    return (
      <div style={{marginTop: 100}}>
        <LoadingInProgress />
      </div>
    )
  }

  const stakePools = data.stakePools || []

  if (!loading && !error && !stakePools.length) {
    // TODO: consider using Alert
    return <Typography className={classes.noPools}>{tr(messages.noData)}</Typography>
  }

  // Note: the 'divs' below are intentional as Grid had some issues with overflows
  // TODO: Alert error
  // Note: `Overlay.Wrapper` just dont look nice here
  return (
    <div className={classes.wrapper}>
      <div className={classes.categoriesWrapper}>
        <CategoryHeader title={tr(messages.stakePools)} />
        <CategoryKeys
          categoryConfig={categoryOneConfig}
          categoryLabel={tr(messages.categoryOneLabel)}
        />
        <CategoryKeys
          categoryConfig={categoryTwoConfig}
          categoryLabel={tr(messages.categoryTwoLabel)}
        />
        <CategoryKeys
          categoryConfig={categoryThreeConfig}
          categoryLabel={tr(messages.categoryThreeLabel)}
        />
      </div>
      <div className={classes.scrollWrapper}>
        <Grid container direction="column" className={classes.rowsWrapper}>
          <Grid item>
            <CategoryDataRow data={stakePools} categoryConfig={categoryOneConfig} showHeader />
          </Grid>
          <Grid item>
            <CategoryDataRow data={stakePools} categoryConfig={categoryTwoConfig} />
          </Grid>
          <Grid item>
            <CategoryDataRow data={stakePools} categoryConfig={categoryThreeConfig} />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default ComparisonMatrix
