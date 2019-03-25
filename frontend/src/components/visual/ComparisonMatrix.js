// @flow

import * as React from 'react'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'

import {Grid, Typography, createStyles} from '@material-ui/core'
import {useI18n} from '@/i18n/helpers'
import {VisualHash} from '@/components/visual'

// TODO: full width scenario
// TODO (postpone): colors based on "goodness" for comparable rows

const ellipsizeStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const VALUES_PANEL_WIDTH = 300

const useStyles = makeStyles((theme) => {
  const darkBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.2)}`
  const lightBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.05)}`
  const padding = theme.spacing.unit * 2
  const valuesPanelWidth = `${VALUES_PANEL_WIDTH}px`
  return createStyles({
    ellipsis: ellipsizeStyles,
    wrapper: {
      margin: theme.spacing.unit * 6,
      display: 'flex',
    },
    categoriesWrapper: {
      'background': theme.palette.background.paper,
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
        'background': theme.palette.background.paperContrast,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: fade(
          theme.palette.getContrastText(theme.palette.background.paperContrast),
          0.5
        ),
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
      background: darken(theme.palette.background.default, 0.04),
      padding: theme.spacing.unit * 2.5,
      height: '60px', // Note: otherwise there is +1 pixel strange issue
    },
    visualHashWrapper: {
      height: 20,
      width: 20,
      borderRadius: 10,
      background: theme.palette.background.paper,
      marginRight: theme.spacing.unit,
    },
    itemHeader: {
      width: valuesPanelWidth,
      ...ellipsizeStyles,
    },
    categoryHeader: {
      borderRadius: '5px 0 0 0',
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
  })
})

type CategoryConfigType = Array<{|
  i18nLabel: Object,
  getValue?: (Object, Object) => any,
  render?: (Object, Object) => any,
  height?: number,
|}>

type CategoryKeysProps = {|
  categoryConfig: CategoryConfigType,
  categoryLabel?: string,
|}

const CategoryKeys = ({categoryConfig, categoryLabel}: CategoryKeysProps) => {
  const classes = useStyles()
  const {translate} = useI18n()
  return (
    <Grid className={classes.category} container direction="column">
      {categoryLabel != null && (
        <div className={classes.categogyTitle}>
          <Typography variant="caption">{categoryLabel}</Typography>
        </div>
      )}
      {categoryConfig.map(({i18nLabel, height}) => (
        <Typography
          key={translate(i18nLabel)}
          style={height ? {height} : {}}
          className={classes.categoryKey}
          variant="body1"
        >
          {translate(i18nLabel)}
        </Typography>
      ))}
    </Grid>
  )
}

type CategoryDataProps = {|
  data: Object,
  categoryConfig: CategoryConfigType,
  showGap: boolean,
|}

const CategoryData = ({data, categoryConfig, showGap}: CategoryDataProps) => {
  const classes = useStyles()
  const intlFormatters = useI18n()
  return (
    <Grid className={classes.data} container direction="column" wrap="nowrap">
      {showGap && <div className={classes.categoryGap} />}
      {categoryConfig.map(({getValue, render, height}, index) => (
        <div key={index} className={classes.dataText}>
          {render ? (
            render(data, intlFormatters)
          ) : getValue ? (
            <Typography style={height ? {height} : {}} className={classes.ellipsis} variant="body1">
              {getValue(data, intlFormatters)}
            </Typography>
          ) : null}
        </div>
      ))}
    </Grid>
  )
}

type HeaderProps = {|
  title: string,
  identifier: string,
|}

const Header = ({title, identifier}: HeaderProps) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="row"
      className={classnames(classes.header, classes.itemHeader)}
      wrap="nowrap"
    >
      {/* Note: not working properly when text overflows if not wrapped this way */}
      <Grid item>
        <div className={classes.visualHashWrapper}>
          <VisualHash value={identifier} size={20} />
        </div>
      </Grid>
      <Typography className={classes.ellipsis} variant="overline">
        {title}
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
  data: Array<{name: string}>,
  categoryConfig: CategoryConfigType,
  showHeader?: boolean,
  showGap: boolean,
  getIdentifier: (Object) => string,
|}

const CategoryDataRow = ({
  data,
  showHeader,
  categoryConfig,
  showGap,
  getIdentifier,
}: CategoryDataRowProps) => {
  const classes = useStyles()
  return (
    <Grid container direction="row" wrap="nowrap" className={classes.categoryRowWrapper}>
      {data.map((item, index) => (
        <Grid item key={index}>
          <Grid container direction="column">
            {showHeader && (
              <Grid item>
                <Header title={item.name} identifier={getIdentifier(item)} />
              </Grid>
            )}
            <Grid item>
              <CategoryData data={item} categoryConfig={categoryConfig} showGap={showGap} />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

type ComparisonMatrixProps = {|
  title: string,
  data: Array<{name: string}>,
  categoryConfigs: Array<{
    config: CategoryConfigType,
    categoryLabel?: string,
  }>,
  getIdentifier: (Object) => string,
|}

const ComparisonMatrix = ({data, categoryConfigs, title, getIdentifier}: ComparisonMatrixProps) => {
  const classes = useStyles()

  // Note: the 'divs' below are intentional as Grid had some issues with overflows

  return (
    <div className={classes.wrapper}>
      <div className={classes.categoriesWrapper}>
        <CategoryHeader title={title} />
        {categoryConfigs.map(({config, categoryLabel}, index) => (
          <CategoryKeys key={index} categoryConfig={config} categoryLabel={categoryLabel} />
        ))}
      </div>
      <div className={classes.scrollWrapper}>
        <Grid container direction="column" className={classes.rowsWrapper}>
          {categoryConfigs.map(({config, categoryLabel}, index) => (
            <Grid item key={index}>
              <CategoryDataRow
                getIdentifier={getIdentifier}
                data={data}
                showGap={categoryLabel != null}
                categoryConfig={config}
                showHeader={index === 0}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}

export default ComparisonMatrix
