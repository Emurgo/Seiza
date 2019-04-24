// @flow

import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import {fade} from '@material-ui/core/styles/colorManipulator'
import moment from 'moment'

// TODO: fix, somehow goes to russian
moment.locale('en')

const DEFAULT_GRADIENT = '#ffffff'

// eslint-disable-next-line
// https://stackoverflow.com/questions/29447579/chart-js-add-gradient-instead-of-solid-color-implementing-solution
const getGradient = (id, color, height) => {
  const elem = document.getElementById(id)
  if (!elem) return DEFAULT_GRADIENT
  // $FlowFixMe
  const ctx = elem.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, height * 5)
  gradient.addColorStop(0, fade(color, 0.3))
  gradient.addColorStop(1, fade(color, 0))
  return gradient
}

type Props = {|
  data: Array<Object>,
  height: number,
  dateFormat: string,
  yLabel: string,
|}

export default ({data, height, dateFormat, yLabel}: Props) => {
  const [activeGraph, setActiveGraph] = useState(null)
  const [gradients, setGradients] = useState(null)

  // hack
  const [hoveredByLegend, setHoveredByLegend] = useState(false)

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
      duration: 0,
    },
    hover: {
      // Note: `mode: nearest`
      // Otherwise when hovering over `nth` point in some dataset, all `nth`
      // points in all datasets will be hovered
      mode: 'nearest',
      onHover(event, item) {
        if (hoveredByLegend) return null

        if (item.length) {
          setActiveGraph(item[0]._datasetIndex)
        } else if (activeGraph != null) {
          setActiveGraph(null)
        }
        return null
      },
    },
    legend: {
      onHover(event, item) {
        setActiveGraph(item.datasetIndex)
        setHoveredByLegend(true)
      },
      onLeave() {
        setHoveredByLegend(false)
        setActiveGraph(null)
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            maxTicksLimit: 15,
          },
          type: 'time',
          time: {
            displayFormats: {
              quarter: dateFormat,
            },
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: yLabel,
          },
        },
      ],
    },
  }

  const lineData = {
    datasets: data.map((d, index) => ({
      data: d.data,
      label: d.label,
      fill: activeGraph === index ? 'start' : false,
      borderColor: d.color,
      pointBackgroundColor: d.color,
      backgroundColor: gradients ? gradients[d.id] : DEFAULT_GRADIENT,
      pointRadius: 3,
      pointHitRadius: 5,
      borderWidth: 2,
    })),
  }

  return (
    <React.Fragment>
      <Line data={lineData} id="test-graph" options={lineOptions} height={height} />
    </React.Fragment>
  )
}
