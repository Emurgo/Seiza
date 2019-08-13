// @flow

import React from 'react'
import cn from 'classnames'
import {makeStyles, useTheme} from '@material-ui/styles'
import {Grid, Typography} from '@material-ui/core'
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

const useStyles = makeStyles((theme) => {
  const cell = {
    display: 'flex',
    alignItems: 'center',
    minWidth: 200,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
    rowsWrapper: {
      '& > :nth-child(even)': {
        backgroundColor: theme.palette.background.default,
      },
    },
    innerWrapper: {
      display: 'flex',
      overflow: 'hidden',
    },
    titleCell: {
      ...cell,
      height: 54,
      width: '100%',
    },
    headerCell: {
      ...cell,
      width: '20%',
      height: 80,
    },
    dataCell: {
      ...cell,
      width: '20%',
      height: 54,
    },
    noColumns: {
      paddingLeft: 100,
    },
  }
})

const Row = ({data}) => {
  const classes = useStyles()
  return (
    <div className="d-flex">
      {data.map((item, index) => (
        <div className={classes.dataCell} key={index}>
          {item}
        </div>
      ))}
    </div>
  )
}

const Rows = ({data}) => {
  return data.map(({values}, index) => (
    <Grid item key={index}>
      <Row data={values} />
    </Grid>
  ))
}

const Headers = ({headers}) => {
  const classes = useStyles()
  return (
    <div className="d-flex">
      {headers.map((header, index) => (
        <div className={classes.headerCell} key={index}>
          {header}
        </div>
      ))}
    </div>
  )
}

const Titles = ({headers, data}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.headerCell}>{headers.title}</div>
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
|}

const StakepoolsTable = ({data, headers, noColumnsMsg, scrollRef, scrollNode}: Props) => {
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
      <ScrollingSideArrow
        onUp={onMouseUp}
        onDown={onArrowLeft}
        direction="left"
        background={backgroundColor}
        active={isHoldingLeft}
        {...{scrollAreaRef, fullScreenScrollRef}}
      />

      <Card className={cn(classes.innerWrapper, 'w-100')}>
        <div className={classes.titlesWrapper}>
          <Titles {...{headers, data}} />
        </div>

        <ScrollOverlayWrapper
          upBackground={darken(backgroundColor, 0.01)}
          downBackground={darken(backgroundColor, 0.01)}
          borderRadius={BORDER_RADIUS}
          className="w-100"
        >
          <div className={cn(classes.scrollWrapper, 'w-100')} ref={scrollRef}>
            <Grid container direction="column" className={cn(classes.rowsWrapper, 'w-100')}>
              <Headers headers={headers.values} />
              <Rows data={data} />
            </Grid>
          </div>
        </ScrollOverlayWrapper>
      </Card>

      <ScrollingSideArrow
        onUp={onMouseUp}
        onDown={onArrowRight}
        direction="right"
        background={backgroundColor}
        active={isHoldingRight}
        {...{scrollAreaRef, fullScreenScrollRef}}
      />
    </div>
  )
}

export default StakepoolsTable
