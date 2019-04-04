// @flow

import {useEffect} from 'react'
import idx from 'idx'

export const useScrollFromBottom = (refTo: any, dependencies: Array<any>) => {
  useEffect(() => {
    const offsetTop = idx(refTo, (_) => _.current.offsetTop)

    if (offsetTop >= window.scrollY) return

    window.scrollTo({left: 0, top: offsetTop, behavior: 'smooth'})
  }, [refTo, ...dependencies]) // eslint-disable-line
}
