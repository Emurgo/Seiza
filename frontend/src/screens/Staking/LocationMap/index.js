// @flow
import React, {useState} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'
import {LoadScript, GoogleMap, Marker} from '@react-google-maps/api'
import {defineMessages} from 'react-intl'

import config from '@/config'
import {useI18n} from '@/i18n/helpers'
import {VisualHash, Alert, SummaryCard, LoadingInProgress} from '@/components/visual'
import {dangerouslyEmbedIntoDataURI} from '@/helpers/url'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
  },
  mapContainer: {
    'flexGrow': 1,
    'minHeight': 200,
    'maxHeight': 600,

    // We do not have direct control over LoadScript's div
    '&:nth-child(2)': {
      height: '100%',
    },
  },
  poolRowIcon: {
    width: 64,
  },
  poolRowMain: {
    flexGrow: 1,
  },
}))

// This is just an example
const PoolMarker = ({poolHash}) => {
  return (
    <svg width={32} height={40} viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx={16} cy={15} r={20} fill="white" />
      <image
        x={0}
        y={0}
        width={32}
        height={32}
        href={VisualHash.dataURI({value: poolHash, size: 32})}
      />
    </svg>
  )
}

PoolMarker.dataURI = ({poolHash}) =>
  dangerouslyEmbedIntoDataURI(
    'image/svg+xml',
    renderToStaticMarkup(<PoolMarker poolHash={poolHash} />)
  )

const POOLS = [
  {
    hash: 'abc',
    location: {lat: -30, lng: 150},
    name: 'Pool A',
  },
  {
    hash: 'def',
    location: {lat: -10, lng: -10},
    name: 'Pool B',
  },
  {
    hash: 'tmp',
    location: {lat: 47, lng: 11},
    name: 'Adalite.io',
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

  if (!config.googleMapsApiKey) {
    return (
      <div>
        <Typography variant="h4">{tr(messages.missingApiKey)} </Typography>
      </div>
    )
  }

  return error ? (
    <Alert message={tr(messages.errorLoadingMap)} />
  ) : (
    <LoadScript
      googleMapsApiKey={config.googleMapsApiKey}
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
          <Marker
            key={pool.hash}
            position={pool.location}
            title={pool.name}
            icon={PoolMarker.dataURI({poolHash: pool.hash})}
          />
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
        <VisualHash value={pool.hash} size={48} />
      </div>
      <div className={classes.poolRowMain}>
        <div>
          <Typography variant="caption">{pool.name}</Typography>
        </div>
        <div>
          <Typography>
            {pool.location.lat}, {pool.location.lng}
          </Typography>
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
