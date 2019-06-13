// @flow

import {useState, useEffect} from 'react'
import idx from 'idx'

// eslint-disable-next-line
// https://stackoverflow.com/questions/11805955/how-to-get-the-distance-from-the-top-for-an-element/24829409#24829409
const getDistanceFromTop = (element) => {
  let distance = 0

  while (element) {
    distance += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent
  }

  return distance
}

// Note: We expect that header height will not change
export const useScrollFromBottom = (refTo: any, data: any) => {
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // To avoid rescrolling on data refetch
    if (dataLoaded) return
    if (data) setDataLoaded(true)

    const element = idx(refTo, (_) => _.current)
    if (!element) return

    const distanceFromTop = getDistanceFromTop(element)

    if (distanceFromTop < window.scrollY) {
      window.scrollTo({left: 0, top: distanceFromTop, behavior: 'smooth'})
    }
  }, [refTo, data, dataLoaded])
}
