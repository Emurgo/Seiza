// @flow

import * as React from 'react'
import classnames from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {
  Grid,
  Typography,
  Tooltip,
  Modal,
  IconButton,
  ClickAwayListener,
  createStyles,
} from '@material-ui/core'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'
import {ZoomOutMap} from '@material-ui/icons'
import {defineMessages} from 'react-intl'

import {useRequestAnimationFrame} from '@/components/hooks/useRequestAnimationFrame'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'
import {VisualHash, ExternalLink} from '@/components/visual'
import CopyToClipboard from '@/components/common/CopyToClipboard'

// TODO: full width scenario
// TODO (postpone): colors based on "goodness" for comparable rows

const messages = defineMessages({
  copyText: 'Copy',
  fullScreen: 'Full screen mode',
})

const ellipsizeStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const VALUES_PANEL_WIDTH = 300
const PADDING = 16

const useStyles = makeStyles((theme) => {
  const darkBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.2)}`
  const lightBorder = `1px solid ${darken(theme.palette.unobtrusiveContentHighlight, 0.05)}`
  const valuesPanelWidth = `${VALUES_PANEL_WIDTH}px`
  return createStyles({
    ellipsis: ellipsizeStyles,
    wrapper: {
      margin: theme.spacing.unit * 6,
      marginTop: theme.spacing.unit,
      display: 'flex',
      overflow: 'hidden',
    },
    categoriesWrapper: {
      'borderRadius': '5px 0 0 0',
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
      padding: PADDING,
      ...ellipsizeStyles,
    },
    scrollWrapper: {
      'background': theme.palette.background.paper,
      'overflowX': 'auto',
      'borderRadius': '0 5px 0 0',

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
      padding: PADDING,
    },
    header: {
      background: darken(theme.palette.background.default, 0.04),
      paddingRight: theme.spacing.unit * 2.5,
      paddingLeft: theme.spacing.unit * 2.5,
      display: 'flex',
      alignItems: 'center',
      height: '60px', // Note: otherwise there is +1 pixel strange issue
    },
    visualHashWrapper: {
      marginTop: '2px', // Note: strange, but looks better centered
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
      'padding': PADDING,
      '& span': {
        fontWeight: 600,
      },
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

export const CustomTooltip = ({text}: {text: string}) => {
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

export const EllipsizedLinkFieldWithTooltip = ({text}: {text: string}) => {
  const classes = useStyles()
  return (
    <Tooltip title={<CustomTooltip text={text} />} placement="top" interactive>
      {/* Note: Without this extra `div` tooltip is not working */}
      <div>
        <ExternalLink to={text}>
          <Typography variant="body1" className={classes.ellipsis}>
            {text}
          </Typography>
        </ExternalLink>
      </div>
    </Tooltip>
  )
}

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
    text: ({height}) => ({
      overflow: 'hidden',
      height: height - PADDING,
    }),
  }
})

export const FadeoutFieldWithTooltip = ({text, height}: {text: string, height: number}) => {
  const classes = useDescriptionStyles({height})
  // TODO: the tooltip here is not the one from our visual components
  // because it looks messy
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
          <VisualHash value={identifier} size={24} />
        </div>
      </Grid>
      <Grid item>
        <Typography className={classes.ellipsis} variant="overline">
          {title}
        </Typography>
      </Grid>
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
  scrollRef?: any,
|}

const ComparisonMatrixLayout = ({
  data,
  categoryConfigs,
  title,
  getIdentifier,
  scrollRef,
}: ComparisonMatrixProps) => {
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
    </div>
  )
}

const useFullWidthStyles = makeStyles((theme) => ({
  fullScreenWrapper: {
    display: 'flex',
    margin: 'auto',
    overflow: 'auto',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit * 5,
    outline: 'none',
    maxWidth: '1920px',
  },
  openFullScreenWrapper: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 5,
  },
  openFullScreen: {
    width: 'initial',
    cursor: 'pointer',
  },
  modal: {
    overflow: 'auto',
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

const useKeyboardScrolling = (el, speed) => {
  const [scrollStep, setScrollStep] = React.useState(0)

  const scroll = () => {
    if (el == null || scrollStep === 0) return

    // Note: no need to clamp, if value is "out of range", browser will just deal with it
    el.scrollLeft = el.scrollLeft + scrollStep
  }

  const onKeyDown = React.useCallback(
    (e) => {
      const isLeftArrow = e.keyCode === 37
      const isRightArrow = e.keyCode === 39

      if (!isLeftArrow && !isRightArrow) return

      setScrollStep(speed * (isLeftArrow ? -1 : 1))
    },
    [speed]
  )

  const onKeyUp = React.useCallback((e) => setScrollStep(0), [])

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  useRequestAnimationFrame(scroll, scrollStep !== 0)
}

const FullWidthComparisonMatrix = (props) => {
  const scrollRef = React.useRef(null)

  useKeyboardScrolling(scrollRef.current, 14)

  return <ComparisonMatrixLayout {...props} scrollRef={scrollRef} />
}

const ComparisonMatrix = (props: ComparisonMatrixProps) => {
  const classes = useFullWidthStyles()

  return (
    <WithModalState>
      {({isOpen, closeModal, openModal}) => (
        <React.Fragment>
          {!isOpen && (
            <React.Fragment>
              <FullScreenModeOpener onClick={openModal} />
              <ComparisonMatrixLayout {...props} />
            </React.Fragment>
          )}

          <Modal onClose={closeModal} open={isOpen} className={classes.modal}>
            <div className={classes.fullScreenWrapper}>
              <ClickAwayListener onClickAway={closeModal} style={{position: 'relative'}}>
                <FullWidthComparisonMatrix {...props} />
              </ClickAwayListener>
            </div>
          </Modal>
        </React.Fragment>
      )}
    </WithModalState>
  )
}

export default ComparisonMatrix
