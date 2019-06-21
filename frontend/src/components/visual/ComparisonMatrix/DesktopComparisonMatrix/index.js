// @flow

import * as React from 'react'
import classnames from 'classnames'
import {makeStyles, useTheme} from '@material-ui/styles'
import {Grid, Typography, Modal, IconButton, ClickAwayListener} from '@material-ui/core'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'
import {ZoomOutMap} from '@material-ui/icons'
import {defineMessages} from 'react-intl'

import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {Card} from '@/components/visual'

import ScrollingSideArrow from './ScrollingSideArrow'
import {ScrollOverlayWrapper} from './ScrollOverlay'
import {useArrowsScrolling, useKeyboardScrolling} from './scrollingHooks'

import {
  PADDING,
  ellipsizeStyles,
  getHeaderBackground,
  getBodyBackground,
  ItemIdentifier,
} from '../utils'

import type {ComparisonMatrixProps, CategoryConfigType} from '../types'

// TODO (postpone): colors based on "goodness" for comparable rows
// TODO (?): dont show arrows where there is nowhere to scroll
// TODO: further divide into more files

const messages = defineMessages({
  fullScreen: 'Full screen mode',
})

const VALUES_PANEL_WIDTH = 300
const SCROLL_SPEED = 14
const BORDER_RADIUS = 5

const useStyles = makeStyles((theme) => {
  const darkBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.2)}`
  const lightBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.05)}`
  const valuesPanelWidth = `${VALUES_PANEL_WIDTH}px`
  return {
    ellipsis: ellipsizeStyles,
    wrapper: {
      position: 'relative',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
      display: 'flex',
      width: '100%',
    },
    categoriesWrapper: {
      'borderTopLeftRadius': BORDER_RADIUS,
      'background': getBodyBackground(theme),
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
      padding: PADDING,
      ...ellipsizeStyles,
    },
    scrollWrapper: {
      'background': getBodyBackground(theme),
      'overflowX': 'auto',
      'borderTopRightRadius': BORDER_RADIUS,

      '&::-webkit-scrollbar': {
        height: '8px',
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
          0.6
        ),
        outline: '1px solid slategrey',
        borderRadius: BORDER_RADIUS,
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
      padding: PADDING,
    },
    header: {
      background: getHeaderBackground(theme),
      paddingRight: theme.spacing(2.5),
      paddingLeft: theme.spacing(2.5),
      display: 'flex',
      alignItems: 'center',
      height: '60px', // Note: otherwise there is +1 pixel strange issue
    },
    visualHashWrapper: {
      marginTop: '2px', // Note: strange, but looks better centered
      marginRight: theme.spacing(1),
    },
    itemHeader: {
      width: valuesPanelWidth,
      ...ellipsizeStyles,
    },
    categoryHeader: {
      borderTopLeftRadius: BORDER_RADIUS,
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
      'padding': PADDING,
      '& span': {
        fontWeight: 600,
      },
    },
    matrix: {
      display: 'flex',
      overflow: 'hidden',
    },
  }
})

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
          <Typography variant="caption" color="textSecondary">
            {categoryLabel}
          </Typography>
        </div>
      )}
      {categoryConfig.map(({i18nLabel, height}) => (
        <Typography
          key={translate(i18nLabel)}
          style={height ? {height} : {}}
          className={classes.categoryKey}
          variant="body1"
          color="textSecondary"
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
    <div className={classnames(classes.header, classes.itemHeader)}>
      <ItemIdentifier {...{title, identifier}} />
    </div>
  )
}

type CategoryHeaderProps = {|
  title: string,
|}

const CategoryHeader = ({title}: CategoryHeaderProps) => {
  const classes = useStyles()
  return (
    <Typography
      className={classnames(classes.header, classes.categoryHeader)}
      variant="overline"
      color="textSecondary"
    >
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

type ComparisonMatrixLayoutProps = {|
  title: string,
  data: Array<{name: string}>,
  categoryConfigs: Array<{
    config: CategoryConfigType,
    categoryLabel?: string,
  }>,
  getIdentifier: (Object) => string,
  scrollRef: any,
  fullScreenScrollRef?: any,
|}

const ComparisonMatrixLayout = ({
  data,
  categoryConfigs,
  title,
  getIdentifier,
  scrollRef,
  fullScreenScrollRef,
}: ComparisonMatrixLayoutProps) => {
  const theme = useTheme()
  const headerBackground = getHeaderBackground(theme)
  const bodyBackground = getBodyBackground(theme)
  const classes = useStyles({headerBackground})

  const scrollAreaRef = React.useRef(null)

  // Note: the 'divs' below are intentional as Grid had some issues with overflows

  const {onArrowLeft, onArrowRight, onMouseUp, isHoldingRight, isHoldingLeft} = useArrowsScrolling(
    scrollRef.current,
    SCROLL_SPEED
  )

  return (
    <div className={classes.wrapper} ref={scrollAreaRef}>
      <ScrollingSideArrow
        onUp={onMouseUp}
        onDown={onArrowLeft}
        direction="left"
        background={bodyBackground}
        active={isHoldingLeft}
        {...{scrollAreaRef, fullScreenScrollRef}}
      />

      <Card className={classes.matrix}>
        <div className={classes.categoriesWrapper}>
          <CategoryHeader title={title} />
          {categoryConfigs.map(({config, categoryLabel}, index) => (
            <CategoryKeys key={index} categoryConfig={config} categoryLabel={categoryLabel} />
          ))}
        </div>

        <ScrollOverlayWrapper
          upBackground={headerBackground}
          downBackground={bodyBackground}
          borderRadius={BORDER_RADIUS}
        >
          <div className={classes.scrollWrapper} ref={scrollRef}>
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
        </ScrollOverlayWrapper>
      </Card>

      <ScrollingSideArrow
        onUp={onMouseUp}
        onDown={onArrowRight}
        direction="right"
        background={bodyBackground}
        active={isHoldingRight}
        {...{scrollAreaRef, fullScreenScrollRef}}
      />
    </div>
  )
}

const useFullWidthStyles = makeStyles((theme) => ({
  fullScreenWrapper: {
    display: 'flex',
    margin: 'auto',
    overflow: 'auto',
    justifyContent: 'center',
    paddingTop: theme.spacing(5),
    outline: 'none',
    maxWidth: '1920px',
  },
  openFullScreenWrapper: {
    paddingTop: theme.spacing(),
    paddingLeft: theme.spacing(11),
  },
  openFullScreen: {
    width: 'initial',
    cursor: 'pointer',
  },
  // In order to listen to 'onscroll' event, we need to remove overflow from
  // material modal where listening to scrolling is disabled, so we can later set it
  // to our 'fakeModal'. In order to retain layout fakeModal, is styled similar to material modal.
  modal: {
    overflow: 'hidden',
  },
  fakeModal: {
    overflow: 'auto',
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  clickAwayChild: {
    display: 'flex',
    overflow: 'hidden',
  },
}))

const FullScreenModeOpener = ({onClick}) => {
  const {translate: tr} = useI18n()
  const classes = useFullWidthStyles()
  return (
    <Grid container className={classes.openFullScreenWrapper}>
      <Grid item>
        <Grid container alignItems="center" onClick={onClick} className={classes.openFullScreen}>
          <IconButton>
            <ZoomOutMap color="primary" />
          </IconButton>
          <Typography variant="overline">{tr(messages.fullScreen)}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

const FullWidthComparisonMatrix = ({fullScreenScrollRef, ...rest}) => {
  const scrollRef = React.useRef(null)
  useKeyboardScrolling(scrollRef.current, SCROLL_SPEED)
  return (
    <ComparisonMatrixLayout
      {...rest}
      scrollRef={scrollRef}
      fullScreenScrollRef={fullScreenScrollRef}
    />
  )
}

const StandardComparisonMatrix = (props) => {
  const scrollRef = React.useRef(null)
  return <ComparisonMatrixLayout {...props} scrollRef={scrollRef} />
}

const ComparisonMatrix = (props: ComparisonMatrixProps) => {
  const classes = useFullWidthStyles()
  const fullScreenScrollRef = React.useRef(null)

  return (
    <WithModalState>
      {({isOpen, closeModal, openModal}) => (
        <React.Fragment>
          {!isOpen && (
            <React.Fragment>
              <FullScreenModeOpener onClick={openModal} />
              <StandardComparisonMatrix {...props} />
            </React.Fragment>
          )}

          <Modal onClose={closeModal} open={isOpen} className={classes.modal}>
            <div className={classes.fakeModal} ref={fullScreenScrollRef}>
              <div className={classes.fullScreenWrapper}>
                <ClickAwayListener onClickAway={closeModal}>
                  <div className={classes.clickAwayChild}>
                    <FullWidthComparisonMatrix
                      fullScreenScrollRef={fullScreenScrollRef}
                      {...props}
                    />
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      )}
    </WithModalState>
  )
}

export default ComparisonMatrix
