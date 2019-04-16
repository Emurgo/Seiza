// @flow

import React, {useState, useEffect} from 'react'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Label} from 'recharts'
// $FlowFixMe flow does not know about `useTheme`
import {makeStyles, useTheme} from '@material-ui/styles'
import {lighten, fade, darken} from '@material-ui/core/styles/colorManipulator'
import {Grid, Typography} from '@material-ui/core'

import {Card} from '@/components/visual'

const getBarColors = (theme) => [
  lighten(theme.palette.primary.main, 0.5),
  lighten(theme.palette.primary.main, 0.2),
]

const CHART_MARGIN = {
  top: 20,
  right: 40,
  left: 40,
  bottom: 20,
}

const useStyles = makeStyles((theme) => {
  const [baseColor, activeColor] = getBarColors(theme)
  return {
    // Note: not working without `@global`
    '@global': {
      '@keyframes home-chart-bar': {
        '0%': {
          fill: baseColor,
        },
        '100%': {
          fill: activeColor,
        },
      },
    },
    'bar': {
      fill: baseColor,
    },
    'barActive': {
      fill: activeColor,
      animation: 'home-chart-bar 500ms',
    },
    'cursor': {
      fill: fade(darken(theme.palette.background.default, 0.1), 0.5),
    },
    'barLabel': {
      fill: activeColor,
    },
    'lastBar': {
      fill: fade(baseColor, 0.4),
    },
    'tooltip': {
      padding: theme.spacing.unit,
    },
  }
})

const getPath = (x, y, width, height) => {
  const borderRadius = Math.min(10, height)

  // C: bezier curve
  // L: line
  return `M${x},${y + height}
          L${x + width},${y + height}
          L${x + width},${y + borderRadius}
          C${x + width},${y + borderRadius / 2} ${x + width * (3 / 4)},${y} ${x + width / 2},${y}
          L${x + width / 2},${y}
          C${x + width / 4},${y} ${x},${y + borderRadius / 2} ${x},${y + borderRadius}
          L${x},${y + borderRadius}
          L${x},${y}
          Z`
}

const CustomBar = ({x, y, width, height, payload, index, activeBar, itemsCount}: any) => {
  const classes = useStyles()

  // TODO: could we directly pass `isActive` and `isLast` props?
  return (
    <path
      className={
        payload.x === activeBar
          ? classes.barActive
          : itemsCount - 1 === index
            ? classes.lastBar
            : classes.bar
      }
      d={getPath(x, y, width, height)}
      stroke="none"
    />
  )
}

const CustomCursor = ({payload, width, height, x, y, setActiveBar}) => {
  const classes = useStyles()

  useEffect(() => {
    if (!payload.length) return
    const item = payload[0].payload.x
    setActiveBar(item)
  })

  return <rect className={classes.cursor} width={width} height={height} x={x} y={y} />
}

const CustomTooltip = ({
  active,
  payload,
  label,
  lastItem,
  yLabel,
  xLabel,
  formatX,
  formatYTooltip,
  lastTooltipText,
  ...rest
}) => {
  const classes = useStyles()

  if (active && payload && payload.length) {
    return (
      <Card classes={{root: classes.tooltip}}>
        <Grid container>
          <Typography color="textSecondary">{`${xLabel}:`}&nbsp;</Typography>
          <Typography>{formatX(label)}</Typography>
          {/* TODO: could we directly pass `isLast` prop? */}
          {payload[0].payload.x === lastItem.x && <Typography>&nbsp;{lastTooltipText}</Typography>}
        </Grid>
        <Grid container>
          <Typography color="textSecondary">{`${yLabel}:`}&nbsp;</Typography>
          <Typography>{formatYTooltip(payload[0].value)}</Typography>
        </Grid>
      </Card>
    )
  }

  return null
}

type BarChartProps = {|
  data: Array<Object>,
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
  formatX: Function,
  formatYAxis: Function,
  formatYTooltip: Function,
  barSize: number,
  lastTooltipText: string,
|}

// Note: can not use `Typography` inside `Label`, children must be a string
export default ({
  data,
  xLabel,
  yLabel,
  width,
  height,
  formatX,
  formatYAxis,
  formatYTooltip,
  barSize,
  lastTooltipText,
}: BarChartProps) => {
  const [activeBar, setActiveBar] = useState(null)
  const theme = useTheme()

  const [labelColor, activeLabelColor] = getBarColors(theme)
  const textColor = theme.palette.text.primary

  return (
    <BarChart
      onMouseLeave={() => setActiveBar(null)}
      margin={CHART_MARGIN}
      {...{width, height, data}}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="x"
        height={50}
        tickFormatter={formatX}
        label={{value: xLabel, fill: textColor, position: 'insideBottom'}}
      />
      {/* // use tickFormatter also for yAxis */}
      <YAxis width={100} dataKey="y" tickFormatter={formatYAxis}>
        <Label
          angle={-90}
          offset={-5}
          value={yLabel}
          position="insideLeft"
          style={{textAnchor: 'middle'}}
        />
      </YAxis>
      <Tooltip
        isAnimationActive
        // $FlowFixMe recharts pass other props using some `magic`
        cursor={<CustomCursor setActiveBar={setActiveBar} />}
        content={
          // $FlowFixMe recharts pass other props using some `magic`
          <CustomTooltip
            {...{xLabel, yLabel, formatX, formatYTooltip, lastTooltipText}}
            lastItem={data[data.length - 1]}
          />
        }
      />
      <Bar
        barSize={barSize}
        dataKey="y"
        shape={<CustomBar activeBar={activeBar} itemsCount={data.length} />}
        label={false}
      >
        {data.map((entry, index) => (
          <Cell key={entry.x} fill={entry.x === activeBar ? activeLabelColor : labelColor} />
        ))}
      </Bar>
    </BarChart>
  )
}
