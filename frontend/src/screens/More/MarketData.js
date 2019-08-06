import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import gql from 'graphql-tag'
import {compose} from 'redux'
import {graphql} from 'react-apollo'
import moment from 'moment-timezone'

import {LoadingInProgress} from '@/components/visual'
import {DebugApolloError} from '@/components/common'

import {withI18n} from '@/i18n/helpers'

const CONFIG = {
  margin: {
    top: 50,
    right: 110,
    bottom: 50,
    left: 60,
  },
  xScale: {
    type: 'time',
    /* This is input representation format */
    format: '%Y-%m-%dT%H:%M:%S.%LZ',
    precision: 'day',
  },
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto',
  },
  axisBottom: {
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    format: '%b %d',
  },
  axisLeft: {
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Price (USD) i18n',
    legendOffset: -40,
    legendPosition: 'middle',
  },
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      justify: false,
      translateX: 0,
      translateY: 40,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle',
      symbolBorderColor: 'rgba(0, 0, 0, .5)',
      effects: [
        {
          on: 'hover',
          style: {
            itemBackground: 'rgba(0, 0, 0, .03)',
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
}

const _MarketHistory = ({i18n, data}) => {
  if (data.loading) return <LoadingInProgress />
  if (data.error) return <DebugApolloError error={data.error} />

  const rawData = data.marketHistory.data

  const seriesOpen = {
    id: 'open i18n',
    data: rawData.map((item) => ({
      x: item.timePeriod.open,
      y: item.price.open,
    })),
  }
  const seriesLow = {
    id: 'low i18n',
    data: rawData.map((item) => ({
      x: item.timePeriod.open,
      y: item.price.low,
    })),
  }

  const renderTooltip = (slice) => (
    <div style={{color: '#bbb'}}>
      <div>
        {i18n.formatTimestamp(moment(slice.id), {format: i18n.formatTimestamp.FMT_SHORT_DATE})}
      </div>
      {slice.data.map((d) => (
        <div
          key={d.serie.id}
          style={{
            color: d.serie.color,
            padding: '3px 0',
          }}
        >
          <strong>{`${d.serie.id}: `}</strong>
          {i18n.formatFiat(d.data.y, {currency: 'USD'})}
        </div>
      ))}
    </div>
  )

  return (
    <ResponsiveLine
      data={[seriesLow, seriesOpen]}
      margin={CONFIG.margin}
      xScale={CONFIG.xScale}
      yScale={CONFIG.yScale}
      axisTop={null}
      axisRight={null}
      axisBottom={CONFIG.axisBottom}
      axisLeft={CONFIG.axisLeft}
      animate
      tooltip={renderTooltip}
      legends={CONFIG.legends}
    />
  )
}

const MarketHistory = compose(
  withI18n,
  graphql(
    gql`
      query {
        marketHistory(currency: USD) {
          data {
            timePeriod {
              open
            }
            price {
              open
              low
            }
          }
        }
      }
    `
  )
)(_MarketHistory)

export default MarketHistory
