// @flow

import _ from 'lodash'
import React from 'react'
import LineChart from './LineChart'

function getRandomInt(min: number, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateData(count, xMin, xMax, yMin, yMax) {
  const a = _.range(0, count).map((item) => ({
    x: getRandomInt(xMin, xMax),
    y: getRandomInt(yMin, yMax),
  }))
  return _.uniqBy(_.sortBy(a, (d) => d.x), (d) => d.x)
}

export default () => {
  const data = [
    {
      id: 'd1',
      data: generateData(10, 0, 30, 15, 25),
      label: 'Test graph 1',
      color: '#DA4829',
    },
    {
      id: 'd2',
      data: generateData(10, 0, 30, 15, 25),
      label: 'Test graph 2',
      color: '#5450C0',
    },
    {
      id: 'd3',
      data: generateData(10, 0, 30, 0, 5),
      label: 'Test graph 5',
      color: '#50C7C7',
    },
    {
      id: 'd4',
      data: generateData(10, 0, 30, 5, 10),
      label: 'Test graph 3',
      color: '#C750B5',
    },
    {
      id: 'd5',
      data: generateData(30, 0, 30, 5, 10),
      label: 'Test graph 4',
      color: '#50C78F',
    },
  ]

  return (
    <div style={{paddingTop: 50}}>
      <LineChart data={data} height={100} />
    </div>
  )
}
