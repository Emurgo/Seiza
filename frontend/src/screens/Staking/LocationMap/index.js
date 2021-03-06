// @flow
import React, {useState, useEffect} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'
import loadGoogleMapsApi from 'load-google-maps-api'
// Note(ppershing): for some obscure reason, nextjs does not want to load
// '@react-google-maps/api' properly so we use this workaround
import {GoogleMap, Marker} from '@react-google-maps/api/dist/reactgooglemapsapi.es.production.js'
import {defineMessages} from 'react-intl'

import config from '@/config'
import {useI18n} from '@/i18n/helpers'
import {VisualHash, Alert, SummaryCard, LoadingInProgress} from '@/components/visual'
import {dangerouslyEmbedIntoDataURI} from '@/helpers/url'

import {useLoadSelectedPoolsData} from './dataLoaders'
import {WithEnsureStakePoolsLoaded} from '../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      height: '100vh',
    },
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

const messages = defineMessages({
  errorLoadingMap: 'We were unable to load the map',
  missingApiKey: 'Ooops. We are missing Google maps API key',
})

// https://github.com/tomchentw/react-google-maps/issues/373

const LocationMap = ({pools}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Note(ppershing): THIS IS A WORKAROUND
  // We use loadGoogleMapsApi package
  // to load maps api instead of @react-google-maps/api's [use]LoadScript
  // because that one started to fail in very weird ways (it claims
  // isLoaded before window.google is available)
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true)

      //https://stackoverflow.com/questions/45338480/try-catch-for-error-message-in-google-maps-api
      window.gm_authFailure = () => setError('gm_authFailure')

      loadGoogleMapsApi({
        key: config.googleMapsApiKey,
        language: 'en',
        region: 'EN',
      })
        .then(() => setIsLoaded(true))
        .catch((err) => setError(err))
    }
  }, [isLoading])

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
  ) : !isLoaded ? (
    <LoadingInProgress />
  ) : (
    <GoogleMap
      zoom={2}
      center={{lat: 0, lng: 0}}
      mapContainerStyle={{width: '100%', height: '100%'}}
    >
      {pools.map((pool) => (
        <Marker
          key={pool.poolHash}
          position={pool.location}
          title={pool.name}
          icon={PoolMarker.dataURI({poolHash: pool.poolHash})}
        />
      ))}
    </GoogleMap>
  )
}

const PoolEntry = ({pool}) => {
  const classes = useStyles()
  return (
    <SummaryCard.Row>
      <div className={classes.poolRowIcon}>
        <VisualHash value={pool.poolHash} size={48} />
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
        <PoolEntry pool={pool} key={pool.poolHash} />
      ))}
    </SummaryCard>
  )
}

const LocationMapScreen = () => {
  const classes = useStyles()
  const {error, loading, data} = useLoadSelectedPoolsData()

  return (
    <WithEnsureStakePoolsLoaded {...{error, loading, data}}>
      {({data: pools}) => (
        <div className={classes.root}>
          <div className={classes.mapContainer}>
            <LocationMap pools={pools} />
          </div>
          <LocationList pools={pools} />
        </div>
      )}
    </WithEnsureStakePoolsLoaded>
  )
}

export default LocationMapScreen
