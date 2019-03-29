// @flow

import _ from 'lodash'
import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import {darken, fade} from '@material-ui/core/styles/colorManipulator'

// TODO: use time for x-axes

// https://stackoverflow.com/questions/29447579/chart-js-add-gradient-instead-of-solid-color-implementing-solution
const getGradient = (id, color, height) => {
  const elem = document.getElementById(id)
  const ctx = elem && elem.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, height * 5)
  gradient.addColorStop(0, fade(color, 0.3))
  gradient.addColorStop(1, fade(color, 0))
  return gradient
}

const getLabels = (data) => {
  const allXData = _.flatten(data.map((d) => d.data)).map((d) => d.x)
  const min = Math.min(...allXData)
  const max = Math.max(...allXData)
  return _.range(min, max + 1, 1)
}

const DEFAULT_GRADIENT = '#ffffff'

export default ({data, height}) => {
  const [activeGraph, setActiveGraph] = useState(null)
  const [gradients, setGradients] = useState(null)

  // TODO: depend on data
  useEffect(() => {
    const gradients = data.reduce(
      (acc, d) => ({...acc, [d.id]: getGradient('test-graph', d.color, height)}),
      {}
    )
    setGradients(gradients)
  }, [data, height])

  const lineOptions = {
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
    },
    animation: {
      duration: 0, // general animation time
    },
    hover: {
      // Note: `mode: neareset`
      // Otherwise when hovering over `nth` point in some dataset, all `nth`
      // points in all datasets will be hovered
      mode: 'nearest',
      onHover(event, item) {
        if (item.length) {
          setActiveGraph(item[0]._datasetIndex)
        } else if (activeGraph != null) {
          setActiveGraph(null)
        }
      },
    },
    legend: {},
    tooltips: {},
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      ],
    },
  }

  const lineData = {
    labels: getLabels(data),
    datasets: data.map((d, index) => ({
      data: d.data,
      label: d.label,
      fill: activeGraph === index ? 'start' : false,
      borderColor: d.color,
      pointBackgroundColor: d.color,
      backgroundColor: gradients ? gradients[d.id] : DEFAULT_GRADIENT,
      pointRadius: 4,
    })),
  }

  return (
    <React.Fragment>
      <Line data={lineData} id="test-graph" options={lineOptions} height={height} />
    </React.Fragment>
  )
}
