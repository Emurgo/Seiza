// @flow

import React from 'react'
import cn from 'classnames'
import {makeStyles, useTheme} from '@material-ui/styles'
import {
  Grid,
  Typography,
  Table as MuiTable,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Hidden,
} from '@material-ui/core'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'

import {Card} from '@/components/visual'

import ScrollingSideArrow from '@/components/common/ComparisonMatrix/DesktopComparisonMatrix/ScrollingSideArrow'
import {ScrollOverlayWrapper} from '@/components/common/ComparisonMatrix/DesktopComparisonMatrix/ScrollOverlay'
import {useArrowsScrolling} from '@/components/common/ComparisonMatrix/DesktopComparisonMatrix/scrollingHooks'

// TODO: reuse from comparison matrix
const SCROLL_SPEED = 14
const BORDER_RADIUS = 5
const fullScreenScrollRef = {current: null}

const getBackgroundColor = (theme) => theme.palette.background.paper

const MOBILE_TITLE_WIDTH = 130
const DESKTOP_TITLE_WIDTH = 180
const HEADER_HEIGHT = 80

const useStyles = makeStyles((theme) => {
  const cell = {
    border: 'none',
    padding: 0,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },

    // ellipsize properties
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  return {
    wrapper: {
      position: 'relative',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
      display: 'flex',
      width: '100%',
    },
    titlesWrapper: {
      'borderRight': `2px solid ${darken(theme.palette.background.default, 0.02)}`,
      'borderTopLeftRadius': BORDER_RADIUS,
      '& > :nth-child(even)': {
        backgroundColor: theme.palette.background.default,
      },
    },
    scrollWrapper: {
      'overflowX': 'auto',
      'borderTopRightRadius': BORDER_RADIUS,

      // TODO: reuse comparison matrix styles for scrollBar
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
    table: {
      // Note: setting `backgroundColor` just to 'tr' does not work when scrolling
      '& tbody > :nth-child(odd) td': {
        backgroundColor: theme.palette.background.default,
      },
    },
    innerWrapper: {
      display: 'flex',
      overflow: 'hidden',
    },
    titleCell: {
      ...cell,
      display: 'flex',
      height: 54,
      alignItems: 'center',
      maxWidth: MOBILE_TITLE_WIDTH,
      [theme.breakpoints.up('md')]: {
        maxWidth: DESKTOP_TITLE_WIDTH,
      },
    },
    titleHeader: {
      // to override 'table-cell' when combined with `headerCell` class
      display: 'flex !important',
      alignItems: 'center',
      maxWidth: MOBILE_TITLE_WIDTH,
      [theme.breakpoints.up('md')]: {
        maxWidth: DESKTOP_TITLE_WIDTH,
      },
    },
    headerCell: {
      ...cell,
      height: HEADER_HEIGHT,
      display: 'table-cell',
    },
    dataCell: {
      ...cell,
      height: 54,
      display: 'table-cell',
    },
    noColumns: {
      paddingLeft: 100,
    },
    fullWidthCell: {
      border: 'none',
      width: '100%',
      padding: 0,
    },
  }
})

const Row = ({data, options}) => {
  const classes = useStyles()
  return (
    <TR>
      {data.map((item, index) => (
        <TD align={options[index].align || 'left'} className={classes.dataCell} key={index}>
          {item}
        </TD>
      ))}
      <TD className={classes.fullWidthCell} />
    </TR>
  )
}

const Rows = ({data, options}) => {
  return (
    <TableBody>
      {data.map(({values}, index) => (
        <Row data={values} options={options} key={index} />
      ))}
    </TableBody>
  )
}

const Headers = ({headers}) => {
  const classes = useStyles()
  return (
    <TableHead>
      <TR>
        {headers.map((header, index) => (
          <TD className={classes.headerCell} key={index}>
            {header}
          </TD>
        ))}
        <TD className={classes.fullWidthCell} />
      </TR>
    </TableHead>
  )
}

const Titles = ({headers, data}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={cn(classes.headerCell, classes.titleHeader)}>{headers.title}</div>
      {data.map(({title}, index) => (
        <div className={classes.titleCell} key={index}>
          {title}
        </div>
      ))}
    </React.Fragment>
  )
}

type Props = {|
  data: Array<{|
    title: React$Node,
    values: Array<React$Node>,
  |}>,
  headers: {|
    title: React$Node,
    values: Array<React$Node>,
  |},
  noColumnsMsg: string,
  scrollRef: any,
  scrollNode: any,
  options: Array<{align?: 'right' | 'left' | 'center'}>,
|}

const StakepoolsTable = ({data, headers, noColumnsMsg, scrollRef, scrollNode, options}: Props) => {
  const theme = useTheme()
  const classes = useStyles()
  const scrollAreaRef = React.useRef(null)

  const backgroundColor = getBackgroundColor(theme)

  const {onArrowLeft, onArrowRight, onMouseUp, isHoldingRight, isHoldingLeft} = useArrowsScrolling(
    scrollNode,
    SCROLL_SPEED
  )

  if (headers.values.length === 0) {
    return (
      <Typography variant="overline" className={classes.noColumns}>
        {noColumnsMsg}
      </Typography>
    )
  }

  return (
    <div className={classes.wrapper} ref={scrollAreaRef}>
      <Hidden mdDown implementation="css">
        <div className="h-100">
          <ScrollingSideArrow
            onUp={onMouseUp}
            onDown={onArrowLeft}
            direction="left"
            background={backgroundColor}
            active={isHoldingLeft}
            {...{scrollAreaRef, fullScreenScrollRef}}
          />
        </div>
      </Hidden>

      <Card className={cn(classes.innerWrapper, 'w-100')}>
        <div className={classes.titlesWrapper}>
          <Titles {...{headers, data}} />
        </div>

        <ScrollOverlayWrapper
          upBackground={darken(backgroundColor, 0.01)}
          downBackground={darken(backgroundColor, 0.01)}
          borderRadius={BORDER_RADIUS}
          className="w-100"
          headerHeight={HEADER_HEIGHT}
        >
          <div className={cn(classes.scrollWrapper, 'w-100')} ref={scrollRef}>
            <Grid container direction="column" className="w-100">
              <MuiTable className={classes.table}>
                <Headers headers={headers.values} />
                <Rows {...{data, options}} />
              </MuiTable>
            </Grid>
          </div>
        </ScrollOverlayWrapper>
      </Card>

      <Hidden mdDown implementation="css">
        <div className="h-100">
          <ScrollingSideArrow
            onUp={onMouseUp}
            onDown={onArrowRight}
            direction="right"
            background={backgroundColor}
            active={isHoldingRight}
            {...{scrollAreaRef, fullScreenScrollRef}}
          />
        </div>
      </Hidden>
    </div>
  )
}

export default StakepoolsTable
