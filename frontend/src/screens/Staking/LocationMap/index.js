// @flow
import React, {useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'
import {LoadScript, GoogleMap, Marker} from '@react-google-maps/api'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Alert, SummaryCard, LoadingInProgress} from '@/components/visual'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 4,
  },
  mapContainer: {
    'flexGrow': 1,
    'minHeight': 200,
    'maxHeight': 600,

    // We do not have direct control over LoadScript's div
    '&>*': {
      height: '100%',
    },
  },
  poolRowIcon: {
    width: 50,
  },
  poolRowMain: {
    flexGrow: 1,
  },
}))

// This is just an example
const CustomIcon = () => {
  return (
    <svg height={30} width={30} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx={15} cy={15} r={15} strokeWidth={2} stroke="#f00" fill="#ff0" />
      <text x={0} y={20}>
        SVG
      </text>
    </svg>
  )
}

const renderToDataURI = (component) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(renderToStaticMarkup(component))}`

const POOLS = [
  {
    hash: 'abc',
    location: {lat: -30, lng: 150},
    name: 'Pool A',
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/micons/blue.png',
    },
  },
  {
    hash: 'def',
    location: {lat: -10, lng: -10},
    name: 'Pool B',
    icon: {
      url: renderToDataURI(<CustomIcon />),
    },
  },
  {
    hash: 'tmp',
    location: {lat: 47, lng: 11},
    name: 'Adalite.IO',
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/micons/red.png',
    },
  },
]

const messages = defineMessages({
  errorLoadingMap: 'We were unable to load the map',
  missingApiKey: 'Ooops. We are missing Google maps API key',
})

// https://github.com/tomchentw/react-google-maps/issues/373

const LocationMap = ({pools}) => {
  const [error, setError] = useState()
  const {translate: tr} = useI18n()

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div>
        <h1>{tr(messages.missingApiKey)} </h1>
      </div>
    )
  }

  return error ? (
    <Alert message={tr(messages.errorLoadingMap)} />
  ) : (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      language={'en'}
      region={'EN'}
      version={'weekly'}
      libraries={[]}
      onError={(e) => {
        setError(true)
      }}
      loadingElement={<LoadingInProgress />}
    >
      <GoogleMap
        zoom={2}
        center={{lat: 0, lng: 0}}
        mapContainerStyle={{width: '100%', height: '100%'}}
      >
        {pools.map((pool) => (
          <Marker key={pool.hash} position={pool.location} title={pool.name} icon={pool.icon} />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

const PoolEntry = ({pool}) => {
  const classes = useStyles()
  return (
    <SummaryCard.Row>
      <div className={classes.poolRowIcon}>
        <img src={pool.icon && pool.icon.url} />
      </div>
      <div className={classes.poolRowMain}>
        <div>
          <Typography variant="caption">{pool.name}</Typography>
        </div>
        <div>
          {pool.location.lat}, {pool.location.lng}
        </div>
      </div>
    </SummaryCard.Row>
  )
}

const LocationList = ({pools}) => {
  return (
    <SummaryCard>
      {pools.map((pool) => (
        <PoolEntry pool={pool} key={pool.hash} />
      ))}
    </SummaryCard>
  )
}

const LocationMapScreen = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.mapContainer}>
        <LocationMap pools={POOLS} />
      </div>
      <LocationList pools={POOLS} />
    </div>
  )
}

export default LocationMapScreen
