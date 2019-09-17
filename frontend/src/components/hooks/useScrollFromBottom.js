// @flow

import {useState, useEffect} from 'react'
import idx from 'idx'

import {useIsMobile} from '@/components/hooks/useBreakpoints'

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

// It seems that `offsetTop` just does not work well with sticky elements :(
// TODO: find better solution if possible
export const NAV_HEADER_HEIGHT = 76

// Note: We expect that header height will not change
export const useScrollFromBottom = (refTo: any, data: any) => {
  const [dataLoaded, setDataLoaded] = useState(false)
  const isMobile = useIsMobile()

  const stickyOffset = isMobile ? NAV_HEADER_HEIGHT : 0

  useEffect(() => {
    // To avoid rescrolling on data refetch
    if (dataLoaded) return
    if (data) setDataLoaded(true)

    const element = idx(refTo, (_) => _.current)
    if (!element) return

    const distanceFromTop = getDistanceFromTop(element) - stickyOffset

    if (distanceFromTop < window.scrollY) {
      window.scrollTo({left: 0, top: distanceFromTop, behavior: 'smooth'})
    }
  }, [refTo, data, dataLoaded, stickyOffset])
}
